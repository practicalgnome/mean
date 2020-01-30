import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms-test',
  templateUrl: './forms-test.component.html',
  styleUrls: ['./forms-test.component.css']
})
export class FormsTestComponent implements OnInit {
  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl('')
    }),
    aliases: new FormArray([
      new FormControl('')
    ])
  });
  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer'];

  constructor() { }

  ngOnInit() {
  }

  get aliases() {
    return this.profileForm.get('aliases') as FormArray;
  }

  addAlias() {
    this.aliases.push(new FormControl(''));
  }

  onSubmit() {
    console.log(this.profileForm);
  }

  updateProfile() {
    this.profileForm.patchValue({
      firstName: 'Doe',
      lastName: 'Joe',
      address: {
        zip: 79052
      }
    });
  }
}
