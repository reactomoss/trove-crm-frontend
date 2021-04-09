export interface UserProfile {
  id: number;
  account_id: string;
  first_name: string;
  last_name:	string;
  email: string;
  no_of_employees: string;
  benifical_user:	number;
  company_name:	string;
  phone_number?: number;
work_number?: number;
profile_pic:string;
address?:	string;
description?:	string;
skype_id?: string;
parent_id: number;
welcome_email_sent_at?: string;
verifi_email_sent_at?: string;
email_verified_at?: string;
email_verification_token?: string;
platform:	number;
device_token?: string
record_status: number;
created_by:	number
created_at:	string;
created_ip:	string;
updated_by?: number;
updated_at:	string;
updated_ip?: string;
deleted_by?: number;
deleted_at?: string;
deleted_ip?: string;
role_id?: number;

}
