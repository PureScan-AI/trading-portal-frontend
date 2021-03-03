sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv-WcEtPzXHmALogpsyt69OtSI_1JxQJFzdHZAmQA20SKkWjt1FlqZadMepH9KZ8k0d4ln8KaVaZTV/pub?output=csv";
records = {};
App = {};

function init() {
  
  var links = document.querySelector('header nav').children;
  for(var i=0;i<links.length;i++){
    links[i].addEventListener('click',function(){
      document.querySelector('input').checked=false;
    });
  }

  Papa.parse(sheetUrl,{
    download: true,
    header: true,
    complete: (results) => {
      records = results.data.filter(function(record){
        return record.active && record.active.toLowerCase()=="true";
      });
      
      document.querySelector("#loading").style.display = "none";
      document.querySelector("#portalApp").style.display = "grid";
      
      
      appObj = {
        data() {
          return {
            records: records,
            filters: {
              commodity: "",
              variety: "",
              processing: "",
              quantity: 25,
              minAflatoxin: 0,
              maxAflatoxin: 100
            }
          };
        },
        computed: {
          shownRecords() {
            console.log(this.filters);
            
            var commodity = this.filters.commodity||"";
            var variety = this.filters.variety||"";
            if(!commodity) variety="";
            var processing = this.filters.processing||"";
            var quantity = parseInt(this.filters.quantity||0);
            var minAflatoxin = parseInt(this.filters.minAflatoxin||0);
            var maxAflatoxin = parseInt(this.filters.maxAflatoxin||100);
            
            
            return this.records.filter((record) => {

              if(minAflatoxin > maxAflatoxin){
                return false;
              }
            
              if(commodity && (record.commodity||"").toLowerCase()!=commodity){
                return false;
              }
              if(variety && (record.variety||"").toLowerCase()!=variety){
                return false;
              }
              if(processing && (record.processing||"").toLowerCase()!=processing){
                return false;
              }
              if(quantity && parseInt(record.minimumOrderQuantity||0)>quantity){
                return false;
              }
              
              if(recordMinAflatoxin > recordMaxAflatoxin){
                return false;
              }
            
              
              var recordMinAflatoxin = parseInt(record.aflatoxinMin||0);
              var recordMaxAflatoxin = parseInt(record.aflatoxinMax||100);
                            
              var distinct = minAflatoxin>recordMaxAflatoxin||recordMinAflatoxin>maxAflatoxin;
              
              if(distinct){
                return false;
              } 
              
              return true;
            });
          }
        },
        methods: {
          buy(record) {
            record.buyClicked = true;
          },
          maillink(record) {
            return `mailto:team@purescanai.com?`
              + `Subject=${encodeURIComponent("Purchase Enquiry")}`
              + `&body=${encodeURIComponent("Product ID #" + record.uid + ": " + record.commodity + " from " + record.sellerName)}`;
          }
        }
      }
      
      App = Vue.createApp(appObj).mount("#portalApp");
    }
  });
}
