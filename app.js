/*
MIT License

Copyright (c) 2019 NeedHydra - Paul Martin Gentile

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


class PilotData {
    constructor(pid,arrid) {
      this.pid = pid;
      this.name = "";
      this.bio = arrid;
      this.callsign = arrid;
     // console.log(arrid);
      this.MWPortraitAsset = arrid;
    }
  }

  var textArr = [],
    fullArr = [],
    pilotArr = [];
    var filename;
  var bytearray;
  document
    .querySelector("#file-input")
    .addEventListener("change", function() {
      // list of selected files
      var all_files = this.files;
      if (all_files.length == 0) {
        alert("Error : No file selected");
        return;
      }
      var file = all_files[0];
      filename = file.name;
      console.log(filename);
      // file validation is successful
      // we will now read the file

      var reader = new FileReader();

      // file reading started
      reader.addEventListener("loadstart", function() {
        console.log("File reading started");
      });

      // file reading finished successfully
      reader.addEventListener("load", function(e) {
        bytearray = e.target.result;

        // contents of the file
        console.log(bytearray);

        ReadFile();
      });

      // file reading failed
      reader.addEventListener("error", function() {
        alert("Error : Failed to read file");
      });

      // file read progress
      reader.addEventListener("progress", function(e) {
        if (e.lengthComputable == true) {
          var percent_read = Math.floor((e.loaded / e.total) * 100);
          console.log(percent_read + "% read");
        }
      });

      // read as text file
      reader.readAsArrayBuffer(file);
    });
  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  function ReadFile() {
    console.log("Converting");
    console.log(bytearray.byteLength);
    var CHUNK_SIZE = 1024;
    var id = 0;
    var index = 0,
      startindex = 0,
      lastcharindex;
    var numOfNull = 0;
    var arr = new Uint8Array(bytearray);

    //parse strings
    while (index < bytearray.byteLength) {
      //console.log(index);
      //console.log(arr[index]);
      if (arr[index] == 0) {
        numOfNull++;
      } else if (
        numOfNull >= 4 ||
        (arr[index] == 4 && arr[index + 1] == 0) ||
        (arr[index] == 16 && arr[index - 1] == 0 && arr[index + 1] == 0)
      ) {
        var subarr = arr.subarray(startindex, index);
        var text = ab2str(subarr);

        var p = {
          id: id,
          bytearray: subarr,
          start: startindex,
          end: lastcharindex,
          text: text
        };
        fullArr.push(p);
        if (text.length > 2) {
          textArr.push(p);
          // $("#content").append(
          //    "<p id='l"+id+"'>" + pad(startindex, 10) +" > "+ pad(lastcharindex, 10)+ " : " + text + "</p>"
          // );
        }
        //console.log(text);
        startindex = index;
        lastcharindex = index;
        numOfNull = 0;
        id++;
        setTimeout(0);
      } else {
        lastcharindex = index - 1;
      }
      index++;
    }

    //parse pilots
    //console.log(textArr);
    var pilot;
    var pid = 0;
    for (var i = 0; i < textArr.length; i++) {
      var e = textArr[i];
      if (
        e.text.includes("PilotPersona") &&
        !e.text.includes("PilotPersonaAssetID")
      ) {
        //console.log(e.text);
        if (pilot == null || pilot.name != "") {
          pilot = new PilotData(pid);
          pilotArr.push(pilot);
          pid++;
        }
      } else if (e.text.includes("FullName")) {
        pilot.name = textArr[i ].id;

      } else if (e.text.includes("Bio")) {
        pilot.bio = textArr[i ].id;
      } else if (e.text.includes("Callsign")) {
        pilot.callsign = textArr[ i ].id;
      } else if (e.text.includes("MWPortraitAsset")) {
        pilot.MWPortraitAsset = textArr[i ].id;
      }
      
    }
    setTimeout(0);
    //display pilots
    pilotArr.forEach(e => {
      if(e.name!=undefined&&e.bio!=undefined&&e.callsign!=undefined&&e.MWPortraitAsset!=undefined)
      {
        console.log(fullArr[e.callsign+3])
        console.log(e)
       $("#content").append("<div class='pilot'>"
      +"<div>"
      +"<div class='number'>"+ e.name +"</div>"
      +"<input id='" + e.name + "'type='number' value='4' onchange='AlterRelative(this)'> "
      +" <div id='" + e.name + "'value='" + (e.name+4) + "' class='editable' contenteditable='true'>" + fullArr[e.name + 4].text + "</div>"
      
      + "</div><div>"
          +"<div class='number'>"+ e.bio +"</div>"
      +"<input id='" + e.bio + "'type='number' value='4'onchange='AlterRelative(this)'> "
      +" <div id='" + e.bio  + "'value='" + (e.bio+4) + "' class='editable' contenteditable='true'>" + fullArr[e.bio  + 4].text + "</div>"

      + "</div><div>"
          +"<div class='number'>"+ e.callsign +"</div>"
      +"<input id='" + e.callsign + "'type='number' value='3'onchange='AlterRelative(this)'> "

      +" <div id='" + e.callsign + "'value='" + (e.callsign+3) + "' class='editable' contenteditable='true'>" + fullArr[e.callsign+3].text + "</div>"

      + "</div><div>"
          +"<div class='number'>"+ e.MWPortraitAsset +"</div>"
      +"<input id='" + e.MWPortraitAsset + "'type='number' value='5'onchange='AlterRelative(this)'> "
      +" <div id='" + e.MWPortraitAsset + "'value='" + (e.MWPortraitAsset+5) + "' class='editable' contenteditable='true'>" + fullArr[e.MWPortraitAsset + 5].text + "</div>"
      +"</div></div><br/>");
    } setTimeout(0);
      

    });

    var docs = document.getElementsByClassName("editable");
    console.log(docs);
    for (var i = 0; i < docs.length; i++) {
      docs.item(i).addEventListener(
        "input",
        function(e) {
          var data = fullArr[Number(e.target.attributes["value"].value)];
          
          console.log(data);
          data.text = e.target.innerHTML;
          data.bytearray = toUTF8Array(data.text);
          console.log(data);
          
        },
        false
      );
    }
  }

  function AlterRelative(rel)
  {
    //console.log(Number(rel.id)+Number(rel.value));
    //console.log(rel.id+rel.value);
    rel.nextSibling.nextSibling.setAttribute("value", Number(rel.id)+Number(rel.value));
    rel.nextSibling.nextSibling.innerHTML=fullArr[Number(rel.id)+Number(rel.value)].text;
    //$("editable#"+rel.id).val(text);
    //console.log(rel.nextSibling.nextSibling);
    //console.log( $("div#"+rel.id));
  }

  function pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width
      ? n
      : new Array(width - n.length + 1).join(z) + n;
  }
  function toUTF8Array(str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(
          0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        );
      }
      // surrogate pair
      else {
        i++;
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charcode =
          0x10000 +
          (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        utf8.push(
          0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f)
        );
      }
    }
    return utf8;
  }

  function SaveFile()
  {
    
      console.log("chunking")
      
      var size=0;
      fullArr.forEach(e => {
       size += e.bytearray.length;
       console.log((e.id/bytearray.byteLength/2)+"%");
       setTimeout(0);
      });
      var outbytearray = new Uint8Array(size) ;
      var index=0;
      fullArr.forEach(e => {
          
        outbytearray.set(e.bytearray,index);
        index += e.bytearray.length;
         console.log((e.id/fullArr.length/2+.5)+"%");
         setTimeout(0);
       });
      console.log("Saving")
      saveAs(new Blob([outbytearray.buffer], {type: "example/binary"}), filename);
      console.log("Done Saving")
  }
  function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}