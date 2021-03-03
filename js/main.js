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
      
      
      appObj = {
        data() {
          return {
            records: records,
            filters: {
              commodity: "",
              variety: "",
              processing: "",
              quantity: 25,
            }
          };
        },
        computed: {
          shownRecords() {
            console.log(this.filters);
            
            var commodity = this.filters.commodity||"";
            var variety = this.filters.variety||"";
            var processing = this.filters.processing||"";
            var quantity = parseInt(this.filters.quantity||0);
            return this.records.filter((record) => {
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
              return true;
            });
          }
        }
      }
      
      App = Vue.createApp(appObj).mount("#portalApp");
    }
  });
}
