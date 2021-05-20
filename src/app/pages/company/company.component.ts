import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {SnackBarService} from '../../shared/snack-bar.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { CompanyApiService } from '../../services/company-api.service';
import response_companies from './company.sample'

export interface item {
  id: number;
  name: string;
  owner: string;
  contactCount: number;
  email: string;
  companyName: string;
  company: boolean;
  last: Date;
  city: string;
}

export interface selectedData {
  items: item[]
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  showFilter:boolean = false
  filterCount: number = 0
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  hoveredItem
  //detect for click card, check
  detect: number
  
  allItems = []
  items = []
  selectedItems: item[] = []

  listShow: boolean = false
  typeString: string = 'Companies'
  /*Modal dialog*/
  closeResult = '';
  /*Modal dialog*/

  constructor(
    private modalService: NgbModal,
    private companyApiService: CompanyApiService,
    public dialog: MatDialog, 
    private router: Router, 
    private sb: SnackBarService) {
  }

  triggerSnackBar(message:string, action:string) {
    this.sb.openSnackBarBottomCenter(message, action);
  }

  /*Modal dialog*/
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'dialog001'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }  
  /*Modal dialog*/

  ngOnInit(): void {
    /*const res = response_companies
    if (res.success) {
      const data = res.data.id
      for (const activity in data) {
        const companies: any[] = data[activity]
        companies.map((company, index) => {
          const temp = (index > 0)? company : {...company, category: activity}
          this.items.push({...temp, company: true, last_activity: activity})
          return temp
        })
      }
      this.allItems = this.items
      console.log(this.items)
    }*/

    this.companyApiService.obs.subscribe(() => this.fetchCompanies());
    this.fetchCompanies()
  }

  fetchCompanies() {
    console.log('fetchCompanies')
    const query = {
      view_type: 'grid',
      draw: 0,
      start: 0,
      length: 10,
    }    
    this.companyApiService
      .getCompanyList(query)
      .subscribe((res: any) => {
        //console.log('companies', res)
        if (res.success) {
          this.items = []
          const data = res.data.id
          for (const activity in data) {
              const companies: any[] = data[activity]
              companies.map((company, index) => {
              const temp = (index > 0)? company : {...company, category: activity}
              this.items.push({...temp, company: true, last_activity: activity})
              return temp
            })
          }
          this.allItems = this.items 
          console.log(this.items)
        }
        else {
          this.triggerSnackBar(res.message, 'Close')
        }
      },
      err => {
        this.triggerSnackBar(err.error.message, 'Close')
      })
  }
  
  showList() {
     this.listShow = true
    this.selectedItems = []
  }

  showGrid() {
    this.listShow = false
    this.selectedItems = []
  }

  // selectContact() {
  //   this.items = this.allItems.filter(e => !e.company)
  //   this.typeString = 'Contact'
  //   this.selectedItems = []
  // }

  // selectCompany() {
  //   this.items = this.allItems.filter(e => e.company)
  //   this.typeString = 'Companies'
  //   this.selectedItems = []
  // }

  clickCard(item) {
    this.router.navigate(['/pages/company_detail'])
  }
  clickContactPage() {
    this.router.navigate(['/pages/contact'])
  }

  clickCheck(e, item) {
    this.detect = 1
    e.preventDefault()
    const index = this.selectedItems.indexOf(item, 0)
    if (index > -1) {
      this.selectedItems.splice(index, 1)
    } else {
      this.selectedItems.push(item)
    }
  }

  setCheckStatus(item) {
    const index = this.selectedItems.indexOf(item, 0)
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  showCardCheckBox(item) {
    const index = this.selectedItems.indexOf(item, 0);
    if (this.hoveredItem == item || index > -1)
      return true
    return false
  }

  setHoveredItem(item) {
    this.hoveredItem = item
  }

  clickEmptyCheck() {
    this.selectedItems = [...this.items]
  }

  clickIndeterminate() {
    this.selectedItems = []
  }

  clickEmail() {
    const dialogRef = this.dialog.open(CompanyMailDialog, {
      width: '745px',
      autoFocus: false,
      data: {items: this.selectedItems}
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('result ', result)
      // if (result && result.data && result.data == 'delete') {
      //   this.openConfirmDialog()
      // }
    })
  }
  filterCountChangedHandler(e) {
    this.filterCount = e
  }

  clickFilter(){
    this.showFilter = true
  }

}


@Component({
  selector: 'mail-dialog',
  templateUrl: 'mail-dialog/mail-dialog.html',
  styleUrls: ['mail-dialog/mail-dialog.css']
})
export class CompanyMailDialog {
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }

  activeTabIndex = 0
  items: selectedData
  constructor(
    public dialogRef: MatDialogRef<CompanyMailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: selectedData
  ) {
    this.items = data
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index
    console.log(this.items)
  }

  public titleOptions1: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public titleOptions2: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public titleOptions3: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarInline: true,
    key:'cJC7bA5D3G2F2C2G2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5D5C4E3D2D4D2B2==',
    toolbarBottom: true,
    events: {
      "initialized": () => {
        console.log('initialized');
      },
      "contentChanged": () => {
        console.log("content changed");
      }
    }
  }

  public deleteSelected(item) {
    // console.log('selected', item, this.items.items)
    const index = this.items.items.indexOf(item)
    this.items.items.splice(index, 1)
  }

}
