
let generateDRRPdf = require("./helper/generateDRRPdf")

let value  =[
  {
    offer_name: '40% Food & Beverage on candle light dinner',
    redemption_date_time__c: '2020-08-25T08:23:35.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227409',
    redemption_transaction_code__c: '8038750',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281326'
  },
  {
    offer_name: '40% Food & Beverage on candle light dinner',
    redemption_date_time__c: '2020-08-25T08:15:56.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227410',
    redemption_transaction_code__c: '7935306',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281327'
  },
  {
    offer_name: '40% Food & Beverage on candle light dinner',
    redemption_date_time__c: '2020-08-25T08:00:46.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227408',
    redemption_transaction_code__c: '7934656',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281325'
  },
  {
    offer_name: '40% Food & Beverage on candle light dinner',
    redemption_date_time__c: '2020-08-25T11:22:02.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227420',
    redemption_transaction_code__c: '8045231',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281337'
  },
  {
    offer_name: '40% Food & Beverage',
    redemption_date_time__c: '2020-08-25T07:01:38.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227213',
    redemption_transaction_code__c: '6268575',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281123'
  },
  {
    offer_name: '40% Food & Beverage on candle light dinner',
    redemption_date_time__c: '2020-08-25T08:30:50.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227412',
    redemption_transaction_code__c: '7468480',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281329'
  },
  {
    offer_name: '40% Food & Beverage on candle light dinner',
    redemption_date_time__c: '2020-08-25T08:52:18.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227414',
    redemption_transaction_code__c: '4657580',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281331'
  },
  {
    offer_name: '40% Food & Beverage on candle light dinner',
    redemption_date_time__c: '2020-08-25T08:18:23.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227411',
    redemption_transaction_code__c: '9859052',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281328'
  },
  {
    offer_name: '40% Food & Beverage',
    redemption_date_time__c: '2020-08-25T10:18:58.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227213',
    redemption_transaction_code__c: '8455960',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281123'
  },
  {
    offer_name: '40% Food & Beverage on candle light dinner',
    redemption_date_time__c: '2020-08-25T08:06:37.000Z',
    member_name: 'Mrinal Tripathi',
    membership_number__c: '106916517',
    certifcate_number__c: '2227409',
    redemption_transaction_code__c: '9381952',
    assigned_staff_member__c: null,
    net_amount__c: null,
    hotel_name: 'JW Marriott Aerocity',
    outlet_name: 'Spice Terrace Test',
    cheque_number__c: null,
    hotel_app_user: null,
    offer_unique_identifier__c: '100281326'
  }
]

generateDRRPdf.generateDRRPDF(value).then(d=>{console.log(d)}).catch(e=>{})