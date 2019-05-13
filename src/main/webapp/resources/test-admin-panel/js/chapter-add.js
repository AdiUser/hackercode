(function() {
    var albumBucketName = 'hcvideo212';
    var bucketRegion = 'us-east-1';
    var IdentityPoolId = 'us-east-1:bd02edbc-3f46-4c0e-9ebe-ea8f4f80c8b3';

    AWS.config.update({
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId
        })
    });
    AWS.config.region = 'us-east-1';

    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {
            Bucket: albumBucketName
        }
    });
    var totalSize = 0;
    var loaded = [];
    var obj = {};
    $(document).on("click", ".save-course", function(e) {
        obj = {};
        obj.course_name = $("#c-title").val();
        obj.course_desc = $("#c-desc").val();
        obj.days = $("#d-days").val();
        obj.price = $("#p-price").val();
        obj.mrp = $("#mrp").val();
        obj.tags = $("#tags").val();
        obj.quickDesc = $("#quick-desc").val();
        //obj.img = $("#course-img").files[0];
        obj.chapters = [];
        $(".ch-inp").each(function(e) {
            let chId = $(this)[0].id.split("-").pop();
            obj.chapters[chId - 1] = {
                title: $(this).val(),
                lessons: []
            };
        })

        $(".ln-inp").each(function(e) {
            let blocks = $(this)[0].id.split("-");
            let lnId = blocks.pop();
            let chId = blocks.pop();
            obj.chapters[chId - 1].lessons[lnId - 1] = {
                name: $(this).val(),
                resources: []
            };
        });
        let fd = new FormData();
        let i = 0;
      totalSize = 0;
      loaded = [];
        $(".r-inp").each(function(e) {
            let blocks = $(this)[0].id.split("-");
            let rId = blocks.pop();
            let lnId = blocks.pop();
            let chId = blocks.pop();
            let fileKey = Date.now() + "_" + $(this)[0].files[0].name.replace(/\s/g, "-");
            obj.chapters[chId - 1].lessons[lnId - 1].resources[rId - 1] = {
                file: $(this)[0].files[0],
                key: fileKey
            };
            totalSize += $(this)[0].files[0].size;
            loaded[$(this)[0].files[0].name] = 0;
        });
        console.log("kidked: " + loaded);
        let course = obj.course_name;
        let desc = obj.course_desc;
        let price = obj.price;
        let days = obj.days;
        let tags = obj.tags;
        let mrp = obj.mrp;
        let img = obj.img;
        let quickDesc = obj.quickDesc;

        // upload files 
        obj.chapters.forEach(function(chapter) {
            chapter.lessons.forEach(function(lesson) {
                lesson.resources.forEach(function(res) {
                    // call the upload function.
                    console.log("calling...");
                    uploadFile(res);

                });
            });
        });

       
        console.log(obj);
        /*let formData = objectToFormData(obj);
	for(var pair of formData.entries()) {
		   console.log(pair[0], pair[1]); 
	}*/

    });
    function uploadFile(rs) {
    	console.log("in function ");
        const options = {
            partSize: 5 * 1024 * 1024,
            queueSize: 1
        };
        var dir = encodeURIComponent("resources") + '/';
        console.log(rs);
        //var fileKey = dir +  Date.now() + "_" + fileName;
        s3.upload({
            Key: rs.key,
            Body: rs.file,
            ContentType: rs.file.type,
            ACL: 'public-read'
        }, options)
        .on('httpUploadProgress', function(evt) {
        	 var loadedTotal = 0;
             loaded[this.body.name] = evt.loaded;
             for (var j in loaded) {
                 loadedTotal += loaded[j];
             }
             console.log(loaded)
             var xx = Math.round(loadedTotal / totalSize * 100);
             let totalSizeInMBs = (totalSize/(1024*1024)).toFixed(2);
             let totalLoadedInMBs = (loadedTotal/(1024*1024)).toFixed(2);
             
             $(".progress-container").show();
             $("#bar-progress").attr("style", "width: " + xx + "%");
             $("#percent-progress").html(xx);
             $("#status").html('Uploaded: <span id="done-mb">' + totalLoadedInMBs + 
            		 "</span> of <span id='total-mb'>"+ totalSizeInMBs + "</span> <span id='per'></span>("+ xx +"%)</span>");
             if (loadedTotal === totalSize) {
                 // remove progress bar and 
                 // do other stuff like iterating the obj to store the 
                 // course info.
                 $("#status").html("Finalizing and Saving Course Details...");
                 console.log(obj);
                 let course = obj.course_name;
                 let desc = obj.course_desc;
                 let price = obj.price;
                 let days = obj.days;
                 let tags = obj.tags;
                 let mrp = obj.mrp;
                 let img = obj.img;
                 let quickDesc = obj.quickDesc;
                 obj.chapters.forEach(function(chapter) {
                     let chName = chapter.title;
                     console.log("in chapter");
                     chapter.lessons.forEach(function(lesson) {
                         console.log("in lesson");

                         let fd = new FormData();
                         fd.append('name', course);
                         fd.append('desc', desc);
                         fd.append('price', price);
                         fd.append('totalDays', days);
                         fd.append('chapter', chName);
                         fd.append('lesson', lesson.name);
                         fd.append("tags", tags);
                         fd.append("mrp", mrp);
                         fd.append("subDesc", quickDesc);
                         //fd.append("img", img);

                         let i = 0;
                         lesson.resources.forEach(function(resource) {
                             fd.append('files[' + i++ + ']', resource.key);
                             console.log("key : " + resource.key);
                         });

                        $.ajax({
	         				type: "POST",
	         				url: "/WebHackerCode/upload-course",
	         				data: fd,
	         				contentType: false,
	         			    processData: false,
	         			    async: false,
	         			    beforeSend: function() {
	         			    	console.log("seding data...");
	         			    },
	         			    success: function(data) {
	         			    	if (data === true) {
	         			    		$("#status").html("Course Saved!");
	         			    	}
	         			    },
	         			    error: function(a,c,b) {
	         			    	alert("error");
         			    }
         			});
                     });
                 });
             }
		})
       
        .send(function(err, data){
        	if (!err) {
        		console.log("done");
        	}
        	else{
        		console.log(err);
        	}
        });
        
        return;

    }
    function getChapterHTML(num) {
        return '<div class="course-chapter" id="chapter-' + num + '">\
	      <div class="title">\
		    <div class="row">\
				<div class="col-md-1 trash-bin">\
					<i class="far fa-trash-alt ch-del-btn" id="delete-chapter-' + num + '"></i>\
				</div>\
				<div class="col-md-11">\
					<label for="">Chapter Title</label>\
					<input type="text" id="ch-title-' + num + '" class="form-control ch-inp" placeholder="What is Python..." name="chapterTitle[]" /></div>\
			</div>\
	      </div>\
	    <div class="body" id="chapter-body-' + num + '"></div>';
    }

    function getLessonHTML(chapter, lesson) {
        return '<div class="lesson-title" id="lesson-' + chapter + '-' + lesson + '">\
				<div class="row">\
				 <div class="col-md-1 trash-bin">\
					<i class="far fa-trash-alt ln-del-btn" id="delete-lesson-' + chapter + '-' + lesson + '"></i>\
				</div>\
				<div class="col-md-10">\
					<label for="">lesson Name</label>\
					<input type="text" id="ln-title-' + chapter + '-' + lesson + '" class="form-control ln-inp" placeholder="What is Python..." name="lessonTitle[]" />\
				</div>\
				<div class="col-md-1">\
					<i class="fas fa-plus-circle add-resource" id="add-r-' + chapter + '-' + lesson + '"></i>\
		         </span></div></div></div></div>';
    }

    function getResourceHTML(chapter, lesson, res) {

        return '<div class="row r" id="r-' + chapter + '-' + lesson + '-' + res + '">\
	 <div class="col-md-1 trash-bin">\
		<i class="far fa-trash-alt r-del-btn" id="delete-r-' + chapter + '-' + lesson + '-' + res + '"></i>\
	 </div>\
	 <div class="col-md-11">\
	 <label for="">lesson Source</label>\
		<div class="input-group col-xs-12">\
	     <input type="file" class="form-control file-upload-r r-inp" id="f-upload-' + chapter + '-' + lesson + '-' + res + '" placeholder="Upload Image">\
     <input type="text" class="form-control file-upload-info" id="f-name-' + chapter + '-' + lesson + '-' + res + '" placeholder="Upload Image">\
     <span class="input-group-append">\
       <button class="file-upload-browse btn btn-info" id="f-upload-' + chapter + '-' + lesson + '-' + res + '" type="button">Upload</button>\
     </span>\
	</div></div></div>';
    }

    let chapterNum = 0;
    let lessonNum = 0;

    let pChapter = 0;
    let plesson = 0;
    let pRes = 0;
    let chapterContainer = $("#chapter-container");
    let lnBtn = $("#ls-add");
    let chBtn = $("#ch-add");
    lnBtn.attr("disabled", "disabled");

    chBtn.on("click", function() {
        chapterNum++;
        pChapter = chapterNum;
        pLesson = 0;
        pRes = 0;
        chapterContainer.append(getChapterHTML(chapterNum));

        lnBtn.removeAttr("disabled");

        if (plesson == 0) {
            $("#ch-add").attr("disabled", "disabled");
        } else {
            $("#ch-add").removeAttr("disabled");
        }
    });

    lnBtn.on("click", function() {
        lessonNum++;
        pLesson++;
        pRes = 0;
        $("#chapter-body-" + pChapter).append(getLessonHTML(pChapter, pLesson));

        if (pLesson > 0) {
            chBtn.removeAttr("disabled");
        }
    });

    $(document).on("click", ".ln-del-btn", function(e) {
        let blocks = e.target.id.split("-");
        var lnId = blocks.pop();
        var chId = blocks.pop();
        //alert(lnId + " - " + chId);
        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: '',
            message: '<b>Delete Lesson <i class="fas fa-question"></i></b>',
            position: 'center',
            buttons: [['<button><b>YES</b></button>', function(instance, toast) {
                $("#lesson-" + chId + "-" + lnId).remove();
                instance.hide({
                    transitionOut: 'fadeOut'
                }, toast, 'button');

            }
            , true], ['<button>NO</button>', function(instance, toast) {

                instance.hide({
                    transitionOut: 'fadeOut'
                }, toast, 'button');

            }
            ], ],
            onClosing: function(instance, toast, closedBy) {
                console.info('Closing | closedBy: ' + closedBy);
            },
            onClosed: function(instance, toast, closedBy) {
                console.info('Closed | closedBy: ' + closedBy);
            }
        });
        //alert("#lesson-"+chId+"-"+lnId);
    });

    $(document).on("click", ".ch-del-btn", function(e) {
        let blocks = e.target.id.split("-");
        var chId = blocks.pop();
        //alert(lnId + " - " + chId);
        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: '',
            message: '<b>Do you really want to delete this chapter <i class="fas fa-question"></i></b>',
            position: 'center',
            buttons: [['<button><b>YES</b></button>', function(instance, toast) {
                $("#chapter-" + chId).remove();
                instance.hide({
                    transitionOut: 'fadeOut'
                }, toast, 'button');

            }
            , true], ['<button>NO</button>', function(instance, toast) {

                instance.hide({
                    transitionOut: 'fadeOut'
                }, toast, 'button');

            }
            ], ],
            onClosing: function(instance, toast, closedBy) {
                console.info('Closing | closedBy: ' + closedBy);
            },
            onClosed: function(instance, toast, closedBy) {
                console.info('Closed | closedBy: ' + closedBy);
            }
        });
        //alert("#lesson-"+chId+"-"+lnId);
    })

    $(document).on("click", ".add-resource", function(e) {
        pRes++;
        let blocks = e.target.id.split("-");
        let lsId = blocks.pop();
        let chId = blocks.pop();

        $("#lesson-" + chId + "-" + lsId).append(getResourceHTML(pChapter, pLesson, pRes));
    });

    $(document).on("click", ".r-del-btn", function(e) {
        let blocks = e.target.id.split("-");
        let rId = blocks.pop();
        let lnId = blocks.pop();
        let chId = blocks.pop();

        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: '',
            message: '<b>Delete Lesson Resource <i class="fas fa-question"></i></b>',
            position: 'center',
            buttons: [['<button><b>YES</b></button>', function(instance, toast) {
                $("#r-" + chId + "-" + lnId + "-" + rId).remove();
                instance.hide({
                    transitionOut: 'fadeOut'
                }, toast, 'button');

            }
            , true], ['<button>NO</button>', function(instance, toast) {

                instance.hide({
                    transitionOut: 'fadeOut'
                }, toast, 'button');

            }
            ], ],
            onClosing: function(instance, toast, closedBy) {
                console.info('Closing | closedBy: ' + closedBy);
            },
            onClosed: function(instance, toast, closedBy) {
                console.info('Closed | closedBy: ' + closedBy);
            }
        });

    })
    $(document).on("click", ".file-upload-browse", function(e) {
        let blocks = e.target.id.split("-");
        let rId = blocks.pop();
        let lnId = blocks.pop();
        let chId = blocks.pop();

        $("#f-upload-" + chId + "-" + lnId + "-" + rId).click();
        $(document).on("change", "#f-upload-" + chId + "-" + lnId + "-" + rId, function(e) {
            let name = $("#f-upload-" + chId + "-" + lnId + "-" + rId).val().split("\\").pop();
            $("#f-name-" + chId + "-" + lnId + "-" + rId).val(name);
        })
    });

}
)();
