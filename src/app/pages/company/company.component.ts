import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { SnackBarService} from '../../shared/snack-bar.service'
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { CompanyApiService } from '../../services/company-api.service';
import { CompanyFilters } from './filter/filter.component';
import { DateService } from '../../service/date.service'
import * as moment from 'moment';
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
  @ViewChild('drawer') drawer

  showFilter:boolean = false
  filters: CompanyFilters = null
  scrollOptions = { autoHide: true, scrollbarMinSize: 50 }
  hoveredItem
  //detect for click card, check
  detect: number
  
  allItems = []
  items = []
  owners = []
  selectedItems: item[] = []
  currentCategory = null
  searchText = null

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
    private dateService: DateService,
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
          this.items.push({...company, category: activity, company: true, last_activity: company.updated_at})
          !this.owners.find(x => x.id == company.owner.id) && this.owners.push(company.owner)
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
              this.items.push({...company, category: activity, company: true, last_activity: activity})
              !this.owners.find(x => x.id == company.owner.id) && this.owners.push(company.owner)
            })
          }
          this.allItems = this.items 
          //console.log(this.items)
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

  clickCard(item) {
    this.router.navigate(['/pages/company_detail'])
  }

  clickContactPage() {
    this.router.navigate(['/pages/contact'])
  }

  clickCheck(e, item) {
    e.preventDefault()
    this.detect = 1
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

  searchTextChanged(e) {
    console.log('searchTextChanged', e)
    this.filtersChangedHandler(this.filters)
  }

  filtersChangedHandler(filters: CompanyFilters) {
    this.filters = filters
    console.log('filtersChangedHandler', this.filters)
    
    this.items = this.allItems
    if (this.searchText) {
      this.items = this.items.filter(item => item.name.includes(this.searchText))
    }

    if (!filters) {
      return
    }

    if (filters.status && filters.status !== 'All') {
      this.items = this.items.filter(item => item.status == filters.status)
    }

    if (filters.owners.length > 0) {
      this.items = this.items.filter(item => filters.owners.find(owner => owner == item.owner.id))
    }

    if (filters.activity >= 0) {
      let startDate = null, lastDate = null
      if (filters.activity == 6) {
        startDate = moment(this.filters.activityStartDate)
        lastDate = moment(this.filters.activityEndDate)
      }
      else {
        const dateRange = this.dateService.getDateRange(this.filters.activity)
        startDate = dateRange.startDate
        lastDate = dateRange.lastDate
      }
      this.items = this.items.filter(item => {
        const updatedAt = moment(item.updated_at)
        if (startDate && startDate > updatedAt) return false
        if (lastDate && lastDate < updatedAt) return false
        return true
      })
    }

    if (filters.addedon >= 0) {
      let startDate = null, lastDate = null
      if (filters.activity == 6) {
        startDate = moment(this.filters.addedonStartDate)
        lastDate = moment(this.filters.addedonEndDate)
      }
      else {
        const dateRange = this.dateService.getDateRange(this.filters.addedon)
        startDate = dateRange.startDate
        lastDate = dateRange.lastDate
      }
      this.items = this.items.filter(item => {
        const createdAt = moment(item.created_at)
        if (startDate && startDate > createdAt) return false
        if (lastDate && lastDate < createdAt) return false
        return true
      })
    }
  }

  clickFilter() {
    this.drawer.toggle()
    this.showFilter = true
  }

  checkCategory(item) {
    if (item == null) {
      this.currentCategory = null
      return false
    }
    if (item.category && item.category != this.currentCategory) {
      this.currentCategory = item.category
      return true
    }
    return false
  }

  deleteCompany(e) {
    console.log('deleteCompnay', this.selectedItems)
    const companyIds = this.selectedItems.map(item => item.id)
    this.companyApiService
      .deleteCompanyList(companyIds)
      .subscribe((res: any) => {
        console.log('deleteCompany', res)
        //this.triggerSnackBar('Record has been deleted', 'Close')
      },
      err => {
        this.triggerSnackBar(err.error.message, 'Close')
      })
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
    const index = this.items.items.indexOf(item)
    this.items.items.splice(index, 1)
  }
}
