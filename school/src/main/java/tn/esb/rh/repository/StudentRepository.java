package tn.esb.rh.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.esb.rh.entity.Student;

@Repository
public interface StudentRepository extends CrudRepository<Student, Integer>{

}
