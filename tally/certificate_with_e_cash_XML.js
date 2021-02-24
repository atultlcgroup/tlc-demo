let getCertificateTemplate =(data)=> {
    try{
        let certificate = `<ENVELOPE>
        <HEADER>
         <TALLYREQUEST>Import Data</TALLYREQUEST>
        </HEADER>
        <BODY>
         <IMPORTDATA>
          <REQUESTDESC>
           <REPORTNAME>Vouchers</REPORTNAME>
           <STATICVARIABLES>
            <SVCURRENTCOMPANY>${data[0].company_name}</SVCURRENTCOMPANY>
           </STATICVARIABLES>
          </REQUESTDESC>
          <REQUESTDATA>
           <TALLYMESSAGE xmlns:UDF="TallyUDF">
            <VOUCHER VCHKEY="82b03d3a-bbba-4959-9437-4f7c344d64ff-0000aca4:00000010" SENDERID="3105d5c9-a08f-4500-bde5-5b998bc7e009-00000008" VCHTYPE="Sales" ACTION="Create" OBJVIEW="Invoice Voucher View">
             <ADDRESS.LIST TYPE="String">
              <ADDRESS>${data[0].billingstreet}</ADDRESS>
              <ADDRESS>${data[0].billingstate}</ADDRESS>
             </ADDRESS.LIST>
             <BASICBUYERADDRESS.LIST TYPE="String">
              <BASICBUYERADDRESS>Electronic City</BASICBUYERADDRESS>
              <BASICBUYERADDRESS>Bangalore</BASICBUYERADDRESS>
             </BASICBUYERADDRESS.LIST>
             <OLDAUDITENTRYIDS.LIST TYPE="Number">
              <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
             </OLDAUDITENTRYIDS.LIST>
             <DATE>${data[0].createddate}</DATE>
             <INVDELIVERYDATE>${data[0].createddate}</INVDELIVERYDATE>
             <GUID>3105d5c9-a08f-4500-bde5-5b998bc7e009-00000008</GUID>
             <VATDEALERTYPE>Regular</VATDEALERTYPE>
             <STATENAME>${data[0].billingstate}</STATENAME>
             <COUNTRYOFRESIDENCE>${data[0].billingcountry}</COUNTRYOFRESIDENCE>
             <PARTYGSTIN>${data[0].member_gst_details__c}</PARTYGSTIN>
             <PLACEOFSUPPLY>${data[0].billingstate}</PLACEOFSUPPLY>
             <PARTYNAME>${data[0].name}-${data[0].member_id__c}</PARTYNAME>
             <PARTYLEDGERNAME>${data[0].name}-${data[0].member_id__c}</PARTYLEDGERNAME>
             <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
             <VOUCHERNUMBER>    8</VOUCHERNUMBER>
             <BASICBASEPARTYNAME>${data[0].name}-${data[0].member_id__c}</BASICBASEPARTYNAME>
             <CSTFORMISSUETYPE/>
             <CSTFORMRECVTYPE/>
             <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
             <PERSISTEDVIEW>Invoice Voucher View</PERSISTEDVIEW>
             <VATDOCUMENTTYPE>1. Invoice</VATDOCUMENTTYPE>
             <CONSIGNEEGSTIN>${data[0].member_gst_details__c}</CONSIGNEEGSTIN>
             <BASICBUYERNAME>${data[0].name}-${data[0].member_id__c}</BASICBUYERNAME>
             <BASICDATETIMEOFINVOICE>${data[0].createddate}</BASICDATETIMEOFINVOICE>
             <BASICDATETIMEOFREMOVAL>${data[0].createddate}</BASICDATETIMEOFREMOVAL>
             <VCHGSTCLASS/>
             <CONSIGNEEPINNUMBER>${data[0].member_gst_details__c}</CONSIGNEEPINNUMBER>
             <CONSIGNEESTATENAME>${data[0].billingstate}</CONSIGNEESTATENAME>
             <VOUCHERTYPEORIGNAME>Sales</VOUCHERTYPEORIGNAME>
             <DIFFACTUALQTY>No</DIFFACTUALQTY>
             <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
             <ASORIGINAL>No</ASORIGINAL>
             <AUDITED>No</AUDITED>
             <FORJOBCOSTING>No</FORJOBCOSTING>
             <ISOPTIONAL>No</ISOPTIONAL>
             <EFFECTIVEDATE>${data[0].createddate}</EFFECTIVEDATE>
             <USEFOREXCISE>No</USEFOREXCISE>
             <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
             <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
             <USEFORINTEREST>No</USEFORINTEREST>
             <USEFORGAINLOSS>No</USEFORGAINLOSS>
             <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
             <USEFORCOMPOUND>No</USEFORCOMPOUND>
             <USEFORSERVICETAX>No</USEFORSERVICETAX>
             <ISDELETED>No</ISDELETED>
             <ISONHOLD>No</ISONHOLD>
             <ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
             <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
             <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
             <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
             <IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
             <EXCISEOPENING>No</EXCISEOPENING>
             <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
             <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
             <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
             <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
             <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
             <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
             <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
             <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
             <ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
             <ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
             <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
             <ISISDVOUCHER>No</ISISDVOUCHER>
             <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
             <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
             <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
             <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
             <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
             <ISGSTREFUND>No</ISGSTREFUND>
             <ISGSTSECSEVENAPPLICABLE>No</ISGSTSECSEVENAPPLICABLE>
             <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
             <IGNOREEINVVALIDATION>No</IGNOREEINVVALIDATION>
             <IRNJSONEXPORTED>No</IRNJSONEXPORTED>
             <IRNCANCELLED>No</IRNCANCELLED>
             <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
             <ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
             <ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
             <ISCANCELLED>No</ISCANCELLED>
             <HASCASHFLOW>No</HASCASHFLOW>
             <ISPOSTDATED>No</ISPOSTDATED>
             <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
             <ISINVOICE>Yes</ISINVOICE>
             <MFGJOURNAL>No</MFGJOURNAL>
             <HASDISCOUNTS>No</HASDISCOUNTS>
             <ASPAYSLIP>No</ASPAYSLIP>
             <ISCOSTCENTRE>No</ISCOSTCENTRE>
             <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
             <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
             <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
             <ISVOID>No</ISVOID>
             <ORDERLINESTATUS>No</ORDERLINESTATUS>
             <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
             <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
             <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
             <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
             <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
             <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
             <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
             <ISDELETEDVCHRETAINED>No</ISDELETEDVCHRETAINED>
             <CHANGEVCHMODE>No</CHANGEVCHMODE>
             <RESETIRNQRCODE>No</RESETIRNQRCODE>
             <ALTERID> 64</ALTERID>
             <MASTERID> 8</MASTERID>
             <VOUCHERKEY>189820374614030</VOUCHERKEY>
             <EWAYBILLDETAILS.LIST>      </EWAYBILLDETAILS.LIST>
             <EXCLUDEDTAXATIONS.LIST>      </EXCLUDEDTAXATIONS.LIST>
             <OLDAUDITENTRIES.LIST>      </OLDAUDITENTRIES.LIST>
             <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
             <AUDITENTRIES.LIST>      </AUDITENTRIES.LIST>
             <DUTYHEADDETAILS.LIST>      </DUTYHEADDETAILS.LIST>
             <ALLINVENTORYENTRIES.LIST>      </ALLINVENTORYENTRIES.LIST>
             <SUPPLEMENTARYDUTYHEADDETAILS.LIST>      </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
             <IRNERRORLIST.LIST>      </IRNERRORLIST.LIST>
             <INVOICEDELNOTES.LIST>      </INVOICEDELNOTES.LIST>
             <INVOICEORDERLIST.LIST>      </INVOICEORDERLIST.LIST>
             <INVOICEINDENTLIST.LIST>      </INVOICEINDENTLIST.LIST>
             <ATTENDANCEENTRIES.LIST>      </ATTENDANCEENTRIES.LIST>
             <ORIGINVOICEDETAILS.LIST>      </ORIGINVOICEDETAILS.LIST>
             <INVOICEEXPORTLIST.LIST>      </INVOICEEXPORTLIST.LIST>
             <LEDGERENTRIES.LIST>
              <OLDAUDITENTRYIDS.LIST TYPE="Number">
               <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
              </OLDAUDITENTRYIDS.LIST>
              <LEDGERNAME>${data[0].name}-${data[0].member_id__c}</LEDGERNAME>
              <GSTCLASS/>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <LEDGERFROMITEM>No</LEDGERFROMITEM>
              <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
              <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
              <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
              <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
              <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
              <AMOUNT>-${data[0].grand_total__c}</AMOUNT>
              <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
              <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
              <BILLALLOCATIONS.LIST>
               <NAME>12109</NAME>
               <BILLTYPE>New Ref</BILLTYPE>
               <TDSDEDUCTEEISSPECIALRATE>No</TDSDEDUCTEEISSPECIALRATE>
               <AMOUNT>-${data[0].grand_total__c}</AMOUNT>
               <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>
               <STBILLCATEGORIES.LIST>        </STBILLCATEGORIES.LIST>
              </BILLALLOCATIONS.LIST>
              <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
              <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
              <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
              <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
              <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
              <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
              <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
              <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
              <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
              <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
              <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
              <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
              <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
              <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
              <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
              <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
              <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
              <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
              <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
              <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
             </LEDGERENTRIES.LIST>
             


             
             
             `
            //  keep hear
            for(let d of data){
                certificate += `
                <LEDGERENTRIES.LIST>
              <OLDAUDITENTRYIDS.LIST TYPE="Number">
               <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
              </OLDAUDITENTRYIDS.LIST>
              <LEDGERNAME>Certification 1</LEDGERNAME>
              <GSTCLASS/>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <LEDGERFROMITEM>No</LEDGERFROMITEM>
              <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
              <ISPARTYLEDGER>No</ISPARTYLEDGER>
              <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
              <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
              <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
              <AMOUNT>${d.cretificate_gross_amount}</AMOUNT>
              <VATEXPAMOUNT>${d.cretificate_gross_amount}</VATEXPAMOUNT>
              <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
              <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
              <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
              <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
              <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
              <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
              <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
              <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
              <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
              <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
              <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
              <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
              <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
              <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
              <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
              <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
              <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
              <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
              <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
              <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
              <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
              <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
              <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
             </LEDGERENTRIES.LIST>`
            }
             certificate += `
             
             <LEDGERENTRIES.LIST>
             <OLDAUDITENTRYIDS.LIST TYPE="Number">
              <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
             </OLDAUDITENTRYIDS.LIST>
             <LEDGERNAME>Promocode Amount</LEDGERNAME>
             <GSTCLASS/>
             <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
             <LEDGERFROMITEM>No</LEDGERFROMITEM>
             <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
             <ISPARTYLEDGER>No</ISPARTYLEDGER>
             <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
             <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
             <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
             <AMOUNT>-${data[0].promocodeAmt}</AMOUNT>
             <VATEXPAMOUNT>-${data[0].promocodeAmt}</VATEXPAMOUNT>
             <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
             <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
             <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
             <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
             <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
             <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
             <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
             <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
             <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
             <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
             <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
             <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
             <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
             <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
             <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
             <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
             <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
             <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
             <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
             <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
             <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
             <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
             <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
            </LEDGERENTRIES.LIST>

            
         
             
             <LEDGERENTRIES.LIST>
              <OLDAUDITENTRYIDS.LIST TYPE="Number">
               <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
              </OLDAUDITENTRYIDS.LIST>
              <LEDGERNAME>CGST</LEDGERNAME>
              <GSTCLASS/>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <LEDGERFROMITEM>No</LEDGERFROMITEM>
              <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
              <ISPARTYLEDGER>No</ISPARTYLEDGER>
              <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
              <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
              <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
              <AMOUNT>${data[0].CGST}</AMOUNT>
              <VATEXPAMOUNT>${data[0].CGST}</VATEXPAMOUNT>
              <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
              <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
              <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
              <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
              <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
              <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
              <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
              <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
              <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
              <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
              <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
              <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
              <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
              <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
              <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
              <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
              <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
              <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
              <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
              <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
              <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
              <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
              <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
             </LEDGERENTRIES.LIST>
             <LEDGERENTRIES.LIST>
              <OLDAUDITENTRYIDS.LIST TYPE="Number">
               <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
              </OLDAUDITENTRYIDS.LIST>
              <LEDGERNAME>SGST</LEDGERNAME>
              <GSTCLASS/>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <LEDGERFROMITEM>No</LEDGERFROMITEM>
              <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
              <ISPARTYLEDGER>No</ISPARTYLEDGER>
              <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
              <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
              <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
              <AMOUNT>${data[0].SGST}</AMOUNT>
              <VATEXPAMOUNT>${data[0].SGST}</VATEXPAMOUNT>
              <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
              <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
              <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
              <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
              <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
              <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
              <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
              <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
              <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
              <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
              <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
              <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
              <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
              <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
              <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
              <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
              <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
              <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
              <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
              <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
              <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
              <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
              <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
             </LEDGERENTRIES.LIST>
             <LEDGERENTRIES.LIST>
             <OLDAUDITENTRYIDS.LIST TYPE="Number">
              <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
             </OLDAUDITENTRYIDS.LIST>
             <LEDGERNAME>IGST</LEDGERNAME>
             <GSTCLASS/>
             <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
             <LEDGERFROMITEM>No</LEDGERFROMITEM>
             <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
             <ISPARTYLEDGER>No</ISPARTYLEDGER>
             <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
             <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
             <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
             <AMOUNT>${data[0].IGST}</AMOUNT>
             <VATEXPAMOUNT>${data[0].IGST}</VATEXPAMOUNT>
             <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
             <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
             <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
             <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
             <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
             <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
             <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
             <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
             <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
             <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
             <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
             <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
             <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
             <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
             <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
             <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
             <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
             <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
             <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
             <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
             <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
             <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
             <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
            </LEDGERENTRIES.LIST>

            <LEDGERENTRIES.LIST>
            <OLDAUDITENTRYIDS.LIST TYPE="Number">
             <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
            </OLDAUDITENTRYIDS.LIST>
            <LEDGERNAME>UGST</LEDGERNAME>
            <GSTCLASS/>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <LEDGERFROMITEM>No</LEDGERFROMITEM>
            <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
            <ISPARTYLEDGER>No</ISPARTYLEDGER>
            <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
            <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
            <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
            <AMOUNT>${data[0].UGST}</AMOUNT>
            <VATEXPAMOUNT>${data[0].UGST}</VATEXPAMOUNT>
            <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
            <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
            <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
            <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
            <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
            <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
            <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
            <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
            <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
            <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
            <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
            <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
            <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
            <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
            <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
            <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
            <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
            <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
            <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
            <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
            <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
            <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
            <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
           </LEDGERENTRIES.LIST>
          
            <LEDGERENTRIES.LIST>
              <OLDAUDITENTRYIDS.LIST TYPE="Number">
               <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
              </OLDAUDITENTRYIDS.LIST>
              <LEDGERNAME>E-Cash</LEDGERNAME>
              <GSTCLASS/>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <LEDGERFROMITEM>No</LEDGERFROMITEM>
              <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
              <ISPARTYLEDGER>No</ISPARTYLEDGER>
              <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
              <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
              <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
              <AMOUNT>-${data[0].e_cash}</AMOUNT>
              <VATEXPAMOUNT>-${data[0].e_cash}</VATEXPAMOUNT>
              <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
              <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
              <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
              <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
              <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
              <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
              <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
              <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
              <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
              <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
              <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
              <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
              <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
              <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
              <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
              <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
              <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
              <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
              <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
              <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
              <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
              <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
              <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
             </LEDGERENTRIES.LIST>
             <LEDGERENTRIES.LIST>
              <OLDAUDITENTRYIDS.LIST TYPE="Number">
               <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
              </OLDAUDITENTRYIDS.LIST>
              <ROUNDTYPE>Normal Rounding</ROUNDTYPE>
              <LEDGERNAME>Round Off</LEDGERNAME>
              <GSTCLASS/>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <LEDGERFROMITEM>No</LEDGERFROMITEM>
              <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
              <ISPARTYLEDGER>No</ISPARTYLEDGER>
              <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
              <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
              <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
              <ROUNDLIMIT> 1</ROUNDLIMIT>
              <AMOUNT>-0</AMOUNT>
              <VATEXPAMOUNT>-0</VATEXPAMOUNT>
              <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
              <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
              <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
              <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
              <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
              <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
              <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
              <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
              <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
              <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
              <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
              <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
              <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
              <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
              <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
              <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
              <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
              <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
              <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
              <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
              <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
              <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
              <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
             </LEDGERENTRIES.LIST>
             <PAYROLLMODEOFPAYMENT.LIST>      </PAYROLLMODEOFPAYMENT.LIST>
             <ATTDRECORDS.LIST>      </ATTDRECORDS.LIST>
             <GSTEWAYCONSIGNORADDRESS.LIST>      </GSTEWAYCONSIGNORADDRESS.LIST>
             <GSTEWAYCONSIGNEEADDRESS.LIST>      </GSTEWAYCONSIGNEEADDRESS.LIST>
             <TEMPGSTRATEDETAILS.LIST>      </TEMPGSTRATEDETAILS.LIST>
            </VOUCHER>
           </TALLYMESSAGE>
           <TALLYMESSAGE xmlns:UDF="TallyUDF">
            <COMPANY>
             <REMOTECMPINFO.LIST MERGE="Yes">
              <NAME>3105d5c9-a08f-4500-bde5-5b998bc7e009</NAME>
              <REMOTECMPNAME>${data[0].company_name}</REMOTECMPNAME>
              <REMOTECMPSTATE>Delhi</REMOTECMPSTATE>
             </REMOTECMPINFO.LIST>
            </COMPANY>
           </TALLYMESSAGE>
           <TALLYMESSAGE xmlns:UDF="TallyUDF">
            <COMPANY>
             <REMOTECMPINFO.LIST MERGE="Yes">
              <NAME>3105d5c9-a08f-4500-bde5-5b998bc7e009</NAME>
              <REMOTECMPNAME>${data[0].company_name}</REMOTECMPNAME>
              <REMOTECMPSTATE>Delhi</REMOTECMPSTATE>
             </REMOTECMPINFO.LIST>
            </COMPANY>
           </TALLYMESSAGE>
          </REQUESTDATA>
         </IMPORTDATA>
        </BODY>
       </ENVELOPE>
       `
        return certificate
    }catch(e){
        console.log(e)
        return ``
    }
}
module.exports={
    getCertificateTemplate
}
