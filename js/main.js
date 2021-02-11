sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv-WcEtPzXHmALogpsyt69OtSI_1JxQJFzdHZAmQA20SKkWjt1FlqZadMepH9KZ8k0d4ln8KaVaZTV/pub?output=csv";
records = {};
app = {};

function init() {
  Papa.parse(sheetUrl,{
    download: true,
    header: true,
    complete: (results) => {
      records = results.data.filter(function(record){
        return record.active && record.active.toLowerCase()=="true";
      });
      
      
      app = {
        data() {
          return {
            records: records,
          };
        }
      }
      
      Vue.createApp(app).mount("#portalApp");
    }
  });
}
