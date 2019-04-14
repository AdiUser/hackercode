package com.hackercode.dao;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

import com.google.gson.JsonObject;
import com.hackercode.structures.Program;
import com.hackercode.structures.ProgramSpecificTests;
import com.hackercode.structures.Question;
import com.hackercode.structures.Register;
import com.hackercode.structures.Test;
import com.hackercode.structures.TestUser;
import com.hackercode.structures.User;


public interface TestDAO {
	public boolean saveTest(Test test) throws IOException;
	public boolean saveQuestions(int testId, Question q);
	public String getTestData(int testIdentifier, String test_id, String user_id);
	public JsonObject makeAnswerSheet(String data,HttpServletRequest request);
	boolean saveFile(int testId, MultipartFile file) throws IOException;
	boolean isUser(String username, String password, HttpServletRequest request);
	User getUser(String username, HttpServletRequest request);
	public String getStoredTestData(String json);
	public List<ProgramSpecificTests> getAllTest(User u);
	public List<TestUser> getAllFinishedTest(User u);
	public Test getTest(int testId);
	public User getUser(String username);
	public int getUserWithEmail(String email,String username, HttpServletRequest request);
	public User saveUser(Register user);
	public List<Program> getAllPrograms();
	public List<ProgramSpecificTests> getAllTestsByAdmin(User u);
	public List<Question> getQuestionsForTest(String testIdentifier); 
}
