package tn.esb.rh.service;

import java.util.List;

import tn.esb.rh.entity.Student;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import tn.esb.rh.repository.StudentRepository;

@Service
@AllArgsConstructor
public class StudentServiceImpl implements IStudentService {

	private StudentRepository studentRepository;


	public Student registerStudent(Student student) {

		return studentRepository.save(student);
	}

	public List<Student> getStudents() {
		return (List<Student>) studentRepository.findAll();

	}

	public void deleteStudent(Integer id) {
		studentRepository.deleteById(id);
	}

	public Student updateStudent(Student student) {
		Integer rollNumber = student.getRollNumber();
		Student std = studentRepository.findById(rollNumber).get();
		std.setName(student.getName());
		std.setAddress(student.getAddress());
		std.setPercentage(student.getPercentage());

		return studentRepository.save(std);
	}



}
