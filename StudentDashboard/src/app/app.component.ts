import { Component } from '@angular/core';
import { StudentService } from './student.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StudentDashboard';
   studentDetails = null as any;
studentToUpdate = {
   rollNumber:"",
   name:"",
   address:"",
   percentage:""

};

 constructor(private studentService:StudentService){ this.getStudentsDetails();}
  register(registerForm: NgForm ){
     this.studentService.registerStudent(registerForm.value).subscribe(
     (resp) => {

         console.log(resp);
         registerForm.reset();
         this.getStudentsDetails();
     },
     (err) =>{
      console.log(err);
     });
  }


  getStudentsDetails(){
    this.studentService.getStudents().subscribe(
    (resp) => {

        console.log(resp);
        this.studentDetails = resp;
       
    },
    (err) =>{
     console.log(err);
    });
 }

 deleteStudent(student:any){
  this.studentService.deleteStudent(student.rollNumber).subscribe(
  (resp) => {

      console.log(resp);
      this.getStudentsDetails();
       
  },
  (err) =>{
   console.log(err);
  });
}

edit(student:any){

  this.studentToUpdate= student;
}

updateStudent(){

  this.studentService.updateStudent(this.studentToUpdate).subscribe(
    (resp) => {
  
        console.log(resp);
       
         
    },
    (err) =>{
     console.log(err);
    });
  }





}
