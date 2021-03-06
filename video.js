const puppeteer = require('puppeteer')
const url = 'https://movie.douban.com/subject/'
const doubanId = '26384741'
const videoUrl = 'https://movie.douban.com/trailer/228920'
const sleep = (time) => new Promise((resolve) =>{
    setTimeout(resolve,time)
})

;(async () => {
    console.log("开始")
    const brower = await puppeteer.launch({
        args:['--no-sandbox'],
        dumpio:false
    })
    const page = await brower.newPage()
    await page.goto(url+doubanId,{waitUntil: 'networkidle2'})
    
    await sleep(1000)
    const result = await page.evaluate(() => {
        var $ = window.$
        var it = $('.related-pic-video')
        if(it && it.length>0){
            var link = it.attr('href')
            var cover = it.find('img').attr('src')
            return {
                link,
                cover
            }
        }
        return {}
    })
    let video 
    if(result.link){
        await page.goto(result.link,{
            waitUntil: 'networkidle2'
        })
        await sleep(2000)

    }
    video = await page.evaluate(() =>{
        var $ = window.$
        var it = $('source')
        if(it && it.length>0){
            return  it.attr('src')
        }
        return ''
    })
    const data = {
        video,
        doubanId,
        conver:result.cover
    }

    brower.close()
    
    process.send({data})
    process.exit(0)
})()