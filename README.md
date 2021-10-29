# Todo Web-App

* build using node-express.
* used **ejs** for templating.
    * we can write html code inside .ejs
    * we can also write js code by wrapping
    it using a particuler tag(<% js %>).
    * we must render views/html.ejs file by providing **all** of the keys present inside .ejs file
    * we can also use layouts to apply same styles to different pages of website.
    * used ejs to send dynamic values to request.body so that we can seperate data.
* we can create our own local module and export it using **exports**.

**Node:** data will be lost on refreshing, since db is not used.