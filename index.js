const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'hbs');

app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: '.hbs',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});

app.get('/', (req, res) => {
  res.render('scoreboard', {
    data: {
      stylesheets: ['board']
    }
  });
});
