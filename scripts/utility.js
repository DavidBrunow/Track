(function(){
  if (!Array.prototype.indexOfPropertyValue){
    Array.prototype.indexOfPropertyValue = function(propValueArray){
      for (var index = 0; index < this.length; index++){
        //console.log(typeof this[index][propValueArray[0].prop]);
        //console.log(typeof this[index][propValueArray[1].prop]);
        if ("undefined" !== typeof propValueArray[0] 
          && "undefined" !== typeof this[index][propValueArray[0].prop]
          && "undefined" !== typeof propValueArray[1] 
          && "undefined" !== typeof this[index][propValueArray[1].prop]){

          if (this[index][propValueArray[0].prop] == propValueArray[0].value
            && this[index][propValueArray[1].prop] == propValueArray[1].value){
            return index;
          }
        }
        else if("undefined" !== typeof this[index][propValueArray[0].prop])
        {
          if (this[index][propValueArray[0].prop] == propValueArray[0].value){
            return index;
          } 
        }
      }
      return -1;
    }
  }
 })();

 function exportToCsv(filename, rows) {
        var processHeader = function (row) 
        {
            var finalVal = '',
                j = 0;

            for(field in row) {
              
                var innerValue = field === null ? '' : field.toString();
                if (field instanceof Date) {
                    innerValue = field.toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;

                j++;
            }
            return finalVal + '\n';
        }

        var processRow = function (row) {
            var finalVal = '',
                j = 0;

            for(field in row) {
              
                var innerValue = row[field] === null ? '' : row[field].toString();
                if (row[field] instanceof Date) {
                    innerValue = row[field].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;

                j++;
            }
            return finalVal + '\n';
        };

        var csvFile = '';

        if(rows.length > 0)
        {
          csvFile += processHeader(rows[0]);
        }

        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }