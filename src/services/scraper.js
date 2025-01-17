const puppeteer = require('puppeteer');
    //let browser;
/**
 * Go to url and return the page title
 * @param {string} url
 * @returns {string}
 */
// const initBrowser =  async()=>{
//     browser = await puppeteer.launch();
//     return browser
// }
/* async function getAllContent(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
   //await page.goto(url, { waitUntil: 'networkidle0' });
     await page.goto(url);
        const pageTitle = await getPageTitle(page);
        const allMoviesDetails = await getAllMoviesDetails(page);
        await browser.close();
        return {pageTitle, allMoviesDetails: allMoviesDetails}
 } */
async function getPageTitle(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //await page.goto(url, { waitUntil: 'networkidle0' });
    await page.goto(url);
    await page.waitForSelector('head > title');
	const title = await page.evaluate(() => document.querySelector('head > title').innerText);
	await browser.close();
    return title;
}
/**
 * Go to url and return the page title
 * @param {string} url
 * @returns  {ArrayConstructor}
 */
async function getAllMoviesDetails(url) {
    //await page.goto(url, { waitUntil: 'networkidle0' });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('[class="my-3 col-lg-2 col-md-3 col-sm-4 col-6"] a');
	const links = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class="my-3 col-lg-2 col-md-3 col-sm-4 col-6"] a');
		const links = [];
        for (let link of elements) {
			const url =link.href.split("/"); //split link to get appi url
			const urlvalue = url[5]; //get appi index value
            links.push("https://royal-films.com/api/v1/movie/"+urlvalue+"/barranquilla"); //get info from appi
        }
        return links;
    });
    await browser.close();

    const allMoviesDetails = [];

    try {
    const browser = await puppeteer.launch();

        for(let link of links){
          const page = await browser.newPage();
          await page.goto(link);
          const detailsMovie = await page.evaluate(async (link) => {
          //Get Json from urls
          const res = await fetch(link);
          //Set Json
          const detailsMovie = await res.json();
          //Add Moviedata to all movie details
          return detailsMovie;
          },link);

          allMoviesDetails.push({
              originalTitle: detailsMovie.data['original'],
              title: detailsMovie.data['title'],
              synopsis: detailsMovie.data['synopsis'],
              starred: detailsMovie.data['starred'],
              director: detailsMovie.data['director'],
              posterPhoto: detailsMovie.data['poster_photo'],
              trailer: "https://youtube.com/watch?v="+detailsMovie.data.youtube
          }); 
        }
        await browser.close();
                  
      } catch (error) {
          console.log(error);
      }
      await browser.close();
	  return allMoviesDetails;
  }

    // if(process.env.NODE_ENV!= 'test'){
    //     initBrowser();
    // }
//   /**
//  * format raw data and convert it into the requirements
//  * @param {Array} Data 
//  * @returns {Array}
//  */
//   function getDetails(Data){
// 	return Data.map((movie)=>{
// 		return {
// 			originalTitle: movie.original,
// 			title: movie.title,
// 			synopsis: movie.synopsis,
// 			starred: movie.starred,
// 			director: movie.director,
// 			posterPhoto: movie.poster_photo,
// 			trailer: `https://www.youtube.com/watch?v=${movie.youtube}`
// 		}
// 	});
// }


module.exports = {
	getPageTitle,
	getAllMoviesDetails,
    //initBrowser,
    // getAllContent,
	//getDataDetails,
};
