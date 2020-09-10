function sendEmails() {
  var sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1vtiQGPRWnDcAq5AkWZiCBMoir65YjfCkjwIm1sHxBnM/edit').getSheetByName("EmailList");
  var startRow = 2; // First row of data to process
  
  // Get non blank rows minus header row
  var column = sheet.getRange('A:A');
  var values = column.getValues(); // get all data in one call
  var ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  ct=ct-1;//take one away from the header row
  var numRows = ct; // Number of rows to process
  
  if(ct>0){//checks if there are no entries in the sheet
  // Fetch the range of cells A:C
  var dataRange = sheet.getRange(startRow, 1, numRows, 3);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  for (var i in data) {
    var row = data[i];//array of columns in this row. should only contain 3 columns
    var emailAddress = row[0]; // First column
    var subject = row[1]; //Second column
    var message = row[2]; // Third column                                  
    MailApp.sendEmail(emailAddress, subject, message);
  }
  //Clear sheet of followup emails to send
  var wholeSheet = sheet.getRange('A2:C999');
  wholeSheet.clear();
  }
}
function GetEmails() {
  var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1vtiQGPRWnDcAq5AkWZiCBMoir65YjfCkjwIm1sHxBnM/edit').getSheetByName("EmailList");//Specify the sheet to pull data from

  var label = GmailApp.getUserLabelByName("Job search/Follow-Up");// Chang to what ever label you want to work with
  var threads = label.getThreads();

  for (var i=0; i<threads.length; i++)//iterate over the array of labels. This should only be one
  {
    var messages = threads[i].getMessages();

    for (var j=0; j<messages.length; j++)//interate over the array of emails in the label
    {
      var from = messages[j].getFrom();
      var first = from.substring(0, from.indexOf(" "));
      var sub = messages[j].getSubject();
      var body = "Hello "+first+",\n\nI hope all is well. I know how busy you probably are, but I wanted to check in on your decision timeline for this position. I am excited about the opportunity to join your team.\n\nPlease let me know if it would be helpful for me to provide any additional information as you move on to the next stage in the hiring process.\n\nI look forward to hearing from you,\nSteven Donnelly";
      
      //Add new row to sheet
      ss.appendRow([from, sub, body])
    }
    threads[i].addLabel(GmailApp.getUserLabelByName("Job search"));//Add Job search Label
    threads[i].removeLabel(label);//Remove followup Label
  }
    //send alerts if there are queue emails. Email and Calendar
    if(j!=0){
      //Get next Sunday and one hour from next sunday at runtime
      var d = new Date();
      var d2 = new Date();
      d.setDate(d.getDate() + (7 - d.getDay()) % 7);
      d2.setDate(d.getDate());
      d2.setHours(d2.getHours()+1);
      
      CalendarApp.createEvent("WARNING: AUTO FOLLOW-UP", d,d2)
      MailApp.sendEmail("sdonn13@gmail.com", "WARNING: AUTO FOLLOW-UP", "Check the Auto Follow-Up Spreadhseet you have "+j+" auto messages queued! https://docs.google.com/spreadsheets/d/1vtiQGPRWnDcAq5AkWZiCBMoir65YjfCkjwIm1sHxBnM/edit");
    }
}
