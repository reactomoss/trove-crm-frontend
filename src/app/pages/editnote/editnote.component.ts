import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editnote',
  templateUrl: './editnote.component.html',
  styleUrls: ['./editnote.component.css']
})
export class EditnoteComponent implements OnInit {


  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  // input data for company,leads,contacts
  optionsPerson: any[] = [
    {
      name: "Person",
      icon: "person",
      isChecked: false,
      email: "sampleperson@gmail.com"
    },
    {
      name: "Person 2",
      icon: "person",
      isChecked: false,
      email: "sampleperson2@gmail.com"
    },
    {
      name: "Person 3",
      icon: "person",
      isChecked: false,
      email: "sampleperson3@gmail.com"
    }
    ]
    optionsCompany: any[] = [
      {
        name: "Company",  icon: "business" , isChecked: false,
        desc: "Sample Description"
      },
      {
        name: "Company 2",  icon: "business" , isChecked: false,
        desc: "Sample Description2"
      },
      {
        name: "Company 3",  icon: "business" , isChecked: false,
        desc: "Sample Description3"
      }
      ]
      optionsLeads: any[] = [
        {
          name: "Leads",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description"
        },
        {
          name: "Leads 2",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description2"
        },
        {
          name: "Leads 3",  icon: "leaderboard" , isChecked: false,
          desc: "Sample Description3"
        }
        ]

  selected: any[] = []
  // input data for company,leads,contacts
  constructor() { }

  // input data for company,leads,contacts
  public onSelectionChange(event) {
    if(event.isChecked) {
      this.selected.push(event);
    }
    else{
      this.deleteSelected(event);
    }
  }

  deleteSelected(e) {
    e.isChecked = false;
    const index = this.selected.indexOf(e)
    this.selected.splice(index, 1)
  }
  // input data for company,leads,contacts

  public titleOptions1: Object = {
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    // toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }




   attachmentItems: any[] = [
     {
       name: "Sales guide to file.docx",
       size: "55kb"
     },
     {
      name: "Sales guide to file2.docx",
      size: "75kb"
     },
     {
      name: "Sales guide to file3.docx",
      size: "175kb"
     }
   ]


  ngOnInit(): void {
  }

}
