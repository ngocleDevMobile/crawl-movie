const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');

const request = require('request');
const cheerio = require("cheerio");
const fs = require("fs");

const app = express();

//DB Config
const db = require('./config/key').mongoURI;

//Connect Mongonpx
mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
        console.log('MongoDB Connected...');
    })
    .catch(err => console.log(err));

    //Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}));

app.get('/movie', (req,res) => {
  var url = 'https://www.yidio.com/movies/';
  request(url,(error, response,html) => {
    if(!error){
      var $ = cheerio.load(html);
      const dataFilm = $(".cards a");
      let data = [];
      const id = dataFilm.attr('href');
      //console.log(id);
      for (let i = 0; i < dataFilm.length; i++) {
        const dataNew = $(dataFilm[i]);
        const name = dataNew.find('.content > h3').text().trim();
        //let img = dataNew.find('.poster > img').attr('data-src');

        const id = dataNew.attr('href');
        const ids =  id.slice(28);

        const size = ids.length;
        const index = ids.indexOf('/');

        const newId = ids.slice(index+1, size);

       const urlImage = 'https://cfm.yidio.com/images/movie/'+newId+'/poster-193x290.jpg'
         //console.log(ids);
        data.push({
            newId,
            name,
            urlImage
        });
      }
      res.json({
        data: data
      })
    }
  })
});


//getbyid
app.get('/infor', (req, res) => {
  let idLoai = req.body.id;
  var url = 'https://www.yidio.com/movie/blitz/'+idLoai;
  let data = [];
  request(url, (error, response, html) => {
    var $ = cheerio.load(html);
      const inforFilm = $(".top");
      let data = [];
      const body_right = inforFilm.find('.right-column').find('.top-info').find('.center');
      const nameFilm = body_right.find('h1').text().trim();
      const title = body_right.find('.quote').text().trim();
      const description = body_right.find('.additional-info').find('.synopsis > .viewport').text().trim();
      const categories = body_right.find('.additional-info').find('.genre > a').text();
      const year = body_right.find('.additional-info').find('.stats > span').text();
      const cast = body_right.find('.additional-info').find('.info-list').find('dl').find('dd > #stars').text();
      const studio = body_right.find('.additional-info').find('.info-list').find('dl').find('dd > #studio').text();
      const urlImage = 'https:'+inforFilm.find('.left-column').find('.remote-control').find('.movie-image > img').attr('src');

      data.push({
        nameFilm,
        title,
        description,
        categories,
        year,
        cast,
        studio,
        urlImage
      });

      res.json({
        data: data
      })
  })

});

app.get('/tv_show', (req,res) => {
  var url = 'https://www.yidio.com/tv-shows/';
  request(url,(error, response,html) => {
    if(!error){
      var $ = cheerio.load(html);
      const dataFilm = $(".cards a");
      let data = [];
      const id = dataFilm.attr('href');
      //console.log(id);
      for (let i = 0; i < dataFilm.length; i++) {
        const dataNew = $(dataFilm[i]);
        const name = dataNew.find('.content > h3').text().trim();
        //let img = dataNew.find('.poster > img').attr('data-src');

        const id = dataNew.attr('href');
        const ids =  id.slice(28);

        const size = ids.length;
        const index = ids.indexOf('/');

        const newId = ids.slice(index+1, size);

       const urlImage = 'https://cfm.yidio.com/images/tv/'+newId+'/poster-193x290.jpg'
         //console.log(ids);
        data.push({
            newId,
            name,
            urlImage
        });
      }
      res.json({
        data: data
      })
    }
  })
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));