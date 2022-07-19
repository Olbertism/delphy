export default async function handler(req, res) {
  const apiBaseUrl = 'https://newsapi.org/v2/everything?';

  console.log(
    `${apiBaseUrl}q=${encodeURIComponent(
      req.query.query,
    )}&sortBy=relevancy&apiKey=${process.env.NEWSAPI}`,
  );
  const data = await fetch(
    `${apiBaseUrl}q=${encodeURIComponent(
      req.query.query,
    )}&sortBy=relevancy&apiKey=${process.env.NEWSAPI}`,
  ).then((response) => response.json());

  res.json(data); // Send the response
}

/*

This is what an response from the news api looks like. Remember: 100 calls per day, not more...

{
  "status": "ok",
  "totalResults": 620,
  "articles": [
    {
      "source": {
        "id": "wired",
        "name": "Wired"
      },
      "author": "Jeremy White",
      "title": "What’s It Like to Drive NASA’s 1972 Moon Buggy?",
      "description": "OK, we’re 50 years late, but WIRED (finally) caught up with one of only six people to ever ride in the Lunar Roving Vehicle on the moon’s surface.",
      "url": "https://www.wired.com/review/nasa-1972-moon-buggy/",
      "urlToImage": "https://media.wired.com/photos/629a78e904eea05bf2a6b3a2/191:100/w_1280,c_limit/NASA-Moon-Buggy-Gear-GettyImages-1173907293.jpg",
      "publishedAt": "2022-06-04T12:00:00Z",
      "content": "The frenetic pace of gear releases means it is inevitable that WIRED cannot get to all of them in a timely fashion. But if they are important, rest assured, we will catch up eventually. Yes, some may… [+3786 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Gizmodo.com"
      },
      "author": "George Dvorsky",
      "title": "Here's the Latest Prototype of SpaceX's Giant Starship",
      "description": "It’s been nine months since we last saw a new Starship prototype exit the SpaceX factory in Boca Chica, Texas. The unfinished rocket, designated S24, is slated for qualification testing, but the Elon Musk-led company still needs regulatory approval to launch …",
      "url": "https://gizmodo.com/spacex-starship-prototype-s24-testing-1848986170",
      "urlToImage": "https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_675,pg_1,q_80,w_1200/df3abadbbdcd41b83b9a89a3990c186e.png",
      "publishedAt": "2022-05-27T16:25:00Z",
      "content": "Its been nine months since we last saw a new Starship prototype exit the SpaceX factory in Boca Chica, Texas. The unfinished rocket, designated S24, is slated for qualification testing, but the Elon … [+3720 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Yahoo Entertainment"
      },
      "author": "Jennifer Jacobs, Nancy Cook and Isabel Reynolds",
      "title": "US, Japan Launch Bid to Put First Japanese Astronaut on Moon - Yahoo News Canada",
      "description": "<ol><li>US, Japan Launch Bid to Put First Japanese Astronaut on Moon  Yahoo News Canada\r\n</li><li>Fly me to the Moon: US, Japan aim for lunar landing  Phys.org\r\n</li><li>Mission to Moon: How US and Japan plan to once again send humans to the lunar surface  WI…",
      "url": "https://ca.news.yahoo.com/us-japan-launch-bid-put-054445136.html",
      "urlToImage": "https://s.yimg.com/ny/api/res/1.2/rEpqxQjW7LUgWSxbRjZdCg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA-/https://s.yimg.com/uu/api/res/1.2/55Upp5xVHS8Hlkh44nPJcQ--~B/aD0yNjY3O3c9NDAwMDthcHBpZD15dGFjaHlvbg--/https://media.zenfs.com/en/bloomberg_markets_842/06bd808703a6c5b15ad09f350329da4d",
      "publishedAt": "2022-05-23T05:44:45Z",
      "content": "(Bloomberg) -- The US and Japan agreed to work to put the first Japanese astronaut on the moon, accompanied by an American astronaut, as the longtime allies develop a partnership aimed at countering … [+4066 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Hindustan Times"
      },
      "author": "Shaurya Tomer",
      "title": "'Water' on Moon found by China’s Chang'E-5 lander - HT Tech",
      "description": "<ol><li>'Water' on Moon found by China’s Chang'E-5 lander  HT Tech\r\n</li><li>China's lander finds water on the Moon  E&T Magazine\r\n</li><li>China's Chang'E-5 lander finds evidence of native water on the Moon  The Indian Express\r\n</li><li>China's lunar lander …",
      "url": "https://tech.hindustantimes.com/tech/news/water-on-moon-found-by-china-s-chang-e-5-lander-71655359870416.html",
      "urlToImage": "https://images.hindustantimes.com/tech/img/2022/06/16/1600x900/Screen-Shot-2020-12-01-at-11.36.46-e1606843809375_1655360187505_1655360200377.webp",
      "publishedAt": "2022-06-16T06:17:42Z",
      "content": "In an amazing series of events, Chinas Chang'E-5 lunar lander has confirmed the evidence of native water on the Moon. The result was confirmed through spectral analysis of samples taken from various … [+1990 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Toronto Star"
      },
      "author": "",
      "title": "NASA fuels moon rocket for 1st time in countdown rehearsal - Toronto Star",
      "description": "<ol><li>NASA fuels moon rocket for 1st time in countdown rehearsal  Toronto Star\r\n</li><li>Live coverage: NASA runs another countdown rehearsal for SLS moon rocket – Spaceflight Now  Spaceflight Now\r\n</li><li>NASA making fourth attempt to complete Artemis 1 W…",
      "url": "https://www.thestar.com/news/world/us/2022/06/20/nasa-fuels-moon-rocket-for-1st-time-in-countdown-rehearsal.html",
      "urlToImage": "https://images.thestar.com/f9YxfZh1SFavv3mY-qmmt4RBBDE=/1280x1024/smart/filters:cb(1655773417642):format(webp)/https://www.thestar.com/content/dam/thestar/news/world/us/2022/06/20/nasa-fuels-moon-rocket-for-1st-time-in-countdown-rehearsal/20220620200620-62b10f63c73af26b621d99bcjpeg.jpg",
      "publishedAt": "2022-06-21T00:30:22Z",
      "content": "CAPE CANAVERAL, Fla. (AP) NASA fueled its huge moon rocket for the first time Monday and went ahead with a critical countdown test despite a fuel line leak.\r\nThis was NASAs fourth crack at the all-im… [+2091 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "The Guardian"
      },
      "author": "Hannah Devlin Science correspondent",
      "title": "Nasa rover sighting reignites fears about human space debris",
      "description": "Mars object thought to be piece of thermal blanket from when Perseverance touched down on planetNasa’s Perseverance rover typically beams back evocative images of bleak dusty landscapes, red-hued sandstorms and Martian rock samples. So its operators were surp…",
      "url": "https://amp.theguardian.com/science/2022/jun/16/nasa-rover-sighting-reignites-fears-about-human-space-debris",
      "urlToImage": "https://i.guim.co.uk/img/media/cf8e7f83a9b34bc510407f2ed5529c863f5a5936/125_127_1372_823/master/1372.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=10c25be3091f47c508fc0eab93ecdb8f",
      "publishedAt": "2022-06-16T11:40:21Z",
      "content": "Nasas Perseverance rover typically beams back evocative images of bleak dusty landscapes, red-hued sandstorms and Martian rock samples. So its operators were surprised to receive an image on Monday o… [+2283 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Yahoo Entertainment"
      },
      "author": "Associated Press",
      "title": "NASA fuels moon rocket for 1st time in countdown rehearsal",
      "description": "NASA fueled its huge moon rocket for the first time Monday and went ahead with a critical countdown test despite a fuel line leak.  This was NASA’s fourth...",
      "url": "https://news.yahoo.com/nasa-fuels-moon-rocket-1st-002226661.html",
      "urlToImage": "https://s.yimg.com/ny/api/res/1.2/zhHF7W.zEgx4SXhTt1sGYA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA-/https://s.yimg.com/uu/api/res/1.2/t6BDo43P5yv_8H8TuWjF8g--~B/aD0yNjY3O3c9NDAwMDthcHBpZD15dGFjaHlvbg--/https://media.zenfs.com/en/ap.org/a48e16ab2276daf7dcea5b949e4f1ce7",
      "publishedAt": "2022-06-21T00:22:26Z",
      "content": "CAPE CANAVERAL, Fla. (AP) NASA fueled its huge moon rocket for the first time Monday and went ahead with a critical countdown test despite a fuel line leak.\r\nThis was NASAs fourth crack at the all-im… [+1765 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Space.com"
      },
      "author": "Leonard David",
      "title": "Teams in New Mexico gear up for Wednesday landing of Boeing Starliner capsule (photos) - Space.com",
      "description": "<ol><li>Teams in New Mexico gear up for Wednesday landing of Boeing Starliner capsule (photos)  Space.com\r\n</li><li>ISS astronauts open hatch to Boeing spacecraft  Associated Press\r\n</li><li>Boeing Starliner Successfully Docks At International Space Station  …",
      "url": "https://www.space.com/boeing-starliner-oft-2-landing-preparations",
      "urlToImage": "https://cdn.mos.cms.futurecdn.net/q6mTZ6L86FtvtdghLT7zNV-1200-80.jpg",
      "publishedAt": "2022-05-23T18:54:18Z",
      "content": "Boeing's Starliner capsule is scheduled to return to Earth on Wednesday (May 25), and teams on the ground have been gearing to welcome the spacecraft home.\r\nStarliner launched May 19\r\n from Cape Cana… [+5130 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Boing Boing"
      },
      "author": "David Pescovitz",
      "title": "Auction of Apollo 11 astronaut Michael Collins's star chart and other space artifacts from his collection",
      "description": "Heritage Auctions is selling a slew of space artifacts that once belonged to Michael Collins, the heroic astronaut who in July 1969 piloted the command module above the Moon while Neil Armstrong and Buzz Aldrin leapt around on the lunar surface. — Read the re…",
      "url": "https://boingboing.net/2022/06/01/auction-of-apollo-11-astronaut-michael-collinss-star-chart-and-other-space-artifacts-from-his-collection.html",
      "urlToImage": "https://i0.wp.com/boingboing.net/wp-content/uploads/2022/06/starchart.jpg?fit=1200%2C749&ssl=1",
      "publishedAt": "2022-06-01T18:09:39Z",
      "content": "Heritage Auctions is selling a slew of space artifacts that once belonged to Michael Collins, the heroic astronaut who in July 1969 piloted the command module above the Moon while Neil Armstrong and … [+1210 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Digital Trends"
      },
      "author": "Trevor Mogg",
      "title": "NASA ready for key launchpad test of its mega moon rocket",
      "description": "NASA engineers have finished work to get its next-generation SLS moon rocket and Orion spacecraft ready for a key launchpad test.",
      "url": "https://www.digitaltrends.com/space/nasa-ready-for-key-launchpad-test-of-its-mega-moon-rocket/",
      "urlToImage": "https://www.digitaltrends.com/wp-content/uploads/2022/03/sls-launchpad-2.jpeg?p=1",
      "publishedAt": "2022-05-27T07:40:12Z",
      "content": "NASA engineers are gearing up for another attempt at a key launchpad test for its next-generation Space Launch System (SLS) rocket and Orion spacecraft following several failed efforts in April. NASA… [+2165 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Slashdot.org"
      },
      "author": "BeauHD",
      "title": "NASA Awards 2 Companies the Chance To Build Lunar Spacesuits",
      "description": "New spacesuits made by Axiom Space and Collins Aerospace could be worn by astronauts that land on the moon later this decade through NASA's Artemis program, the agency announced Wednesday. The suits will also be worn by crew members living and working on the …",
      "url": "https://science.slashdot.org/story/22/06/01/2329251/nasa-awards-2-companies-the-chance-to-build-lunar-spacesuits",
      "urlToImage": "https://a.fsdn.com/sd/topics/nasa_64.png",
      "publishedAt": "2022-06-02T07:00:00Z",
      "content": "The contracts were awarded by NASA as part of its strategy of growing commercial partnerships. Both companies have been selected to move forward in developing the next generation of spacesuits. Depen… [+729 chars]"
    },
    {
      "source": {
        "id": "time",
        "name": "Time"
      },
      "author": "Jeffrey Kluger",
      "title": "New Lunar Spacesuits to Set NASA Back $3.5 Billion",
      "description": "NASA signs a $3.5 billion deal with two companies to build new suits for its Artemis return-to-the-moon program",
      "url": "https://time.com/6183954/nasas-new-moonwalking-suits/",
      "urlToImage": "https://api.time.com/wp-content/uploads/2022/06/Moon-suits.jpg?quality=85&w=985&h=554&crop=1",
      "publishedAt": "2022-06-03T20:13:15Z",
      "content": "Nobody would have known if I had touched Neil Armstrong’s moon-walking suit back in 2018. I wasn’t supposed to touch it—indeed, I was forbidden to touch it—but boy, I could have.\r\nI was in the restor… [+3873 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Hackaday"
      },
      "author": "Tom Nardi",
      "title": "NASA Turns to Commercial Partners for Spacesuits",
      "description": "When NASA astronauts aboard the International Space Station have to clamber around on the outside of the orbiting facility for maintenance or repairs, they don a spacesuit known as the Extravehicul…",
      "url": "https://hackaday.com/2022/06/03/nasa-turns-to-commercial-partners-for-spacesuits/",
      "urlToImage": "https://hackaday.com/wp-content/uploads/2022/06/spacesuits_feat.jpg",
      "publishedAt": "2022-06-03T17:00:28Z",
      "content": "When NASA astronauts aboard the International Space Station have to clamber around on the outside of the orbiting facility for maintenance or repairs, they don a spacesuit known as the Extravehicular… [+6609 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "HYPEBEAST"
      },
      "author": "info@hypebeast.com (HYPEBEAST), HYPEBEAST",
      "title": "Kid Cudi Unveils Moon Man's Landing Festival Lineup",
      "description": "Kid Cudi has unveiled the lineup for the first ever Moon Man's Landing music festival.Set to take place in his home of Cleveland, Ohio on September 17, attendees can catch a headlining performance from Cudder and sets from Playboi Carti, Haim, Don Toliver, Do…",
      "url": "https://hypebeast.com/2022/6/kid-cudi-moon-mans-landing-festival-lineup-announcement-pusha-t-playboi-carti",
      "urlToImage": "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2022%2F06%2Fkid-cudi-moon-mans-landing-festival-lineup-announcement-pusha-t-playboi-carti-tw.jpg?w=960&cbr=1&q=90&fit=max",
      "publishedAt": "2022-06-20T09:16:12Z",
      "content": "Kid Cudi has unveiled the lineup for the first ever Moon Man’s Landing music festival.\r\nSet to take place in his home of Cleveland, Ohio on September 17, attendees can catch a headlining performance … [+1257 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Digital Trends"
      },
      "author": "Trevor Mogg",
      "title": "How to watch NASA’s moon rocket head to launchpad tonight",
      "description": "Fans of slow TV are in for a treat tonight when NASA begins rolling its next-generation moon rocket to the launchpad for testing ahead of a lunar mission.",
      "url": "https://www.digitaltrends.com/news/how-to-watch-nasas-moon-rocket-head-to-launchpad/",
      "urlToImage": "https://www.digitaltrends.com/wp-content/uploads/2021/10/orion-capsule-and-sls.jpeg?p=1",
      "publishedAt": "2022-06-06T00:50:08Z",
      "content": "Fans of slow TV are in for a treat tonight when NASA begins rolling its next-generation moon rocket to the launchpad for testing ahead of a lunar mission in the coming months.\r\nA giant low-slung tran… [+2276 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Digital Trends"
      },
      "author": "Trevor Mogg",
      "title": "How to watch NASA’s moon rocket head to launchpad tonight",
      "description": "Fans of slow TV are in for a treat tonight when NASA begins rolling its next-generation moon rocket to the launchpad for testing ahead of a lunar mission.",
      "url": "https://www.digitaltrends.com/space/how-to-watch-nasas-moon-rocket-head-to-launchpad/",
      "urlToImage": "https://www.digitaltrends.com/wp-content/uploads/2021/10/orion-capsule-and-sls.jpeg?p=1",
      "publishedAt": "2022-06-06T00:50:08Z",
      "content": "Fans of slow TV are in for a treat tonight when NASA begins rolling its next-generation moon rocket to the launchpad for testing ahead of a lunar mission in the coming months.\r\nA giant low-slung tran… [+2276 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "SciTechDaily"
      },
      "author": null,
      "title": "This Week @NASA: Webb's First Images, Next-Gen Spacesuits, and Lunar-Roving Robot - SciTechDaily",
      "description": "<ol><li>This Week @NASA: Webb's First Images, Next-Gen Spacesuits, and Lunar-Roving Robot  SciTechDaily\r\n</li><li>James Webb Space Telescope Set to Study Two Strange Super-Earths  Scientific American\r\n</li><li>New NASA Spacesuits, JWST Color Images Announced,…",
      "url": "https://scitechdaily.com/this-week-nasa-webbs-first-images-next-gen-spacesuits-and-lunar-roving-robot/",
      "urlToImage": "https://scitechdaily.com/images/Webb-First-Images-Next-Gen-Spacesuits-Lunar-Roving-Robot.gif",
      "publishedAt": "2022-06-05T14:54:31Z",
      "content": "ByNASAJune 5, 2022\r\nThe James Webb Space Telescope (JWST or Webb) is an orbiting infrared observatory that will complement and extend the discoveries of the Hubble Space Telescope. It covers longer w… [+4430 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Digital Trends"
      },
      "author": "Trevor Mogg",
      "title": "NASA animations depict highly anticipated Artemis I mission",
      "description": "NASA has released animations that explain in simple terms how it plans to fly its new Orion spacecraft to the moon and back in the Artemis I mission.",
      "url": "https://www.digitaltrends.com/space/nasa-animation-artemis-i-mission/",
      "urlToImage": "https://www.digitaltrends.com/wp-content/uploads/2022/06/artemis-I-animation.jpg?p=1",
      "publishedAt": "2022-06-06T05:50:03Z",
      "content": "NASA is getting closer to conducting its first crewed lunar missions in 50 years as part of the Artemis program, but first it has to test the spaceflight hardware supporting the endeavor.\r\nTo share t… [+2362 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "HYPEBEAST"
      },
      "author": "info@hypebeast.com (HYPEBEAST), HYPEBEAST",
      "title": "Kid Cudi Announces Mysterious \"Moonman's Landing\" Event in Cleveland",
      "description": "A new festival might just be making its way to Cleveland this Fall. Multi-hyphenate Kid Cudi has recently taken to social media to announce a new event that is coming to the city in September.In a simple one-line Tweet, Kid Cudi wrote, \"\"Cleveland...where we …",
      "url": "https://hypebeast.com/2022/6/kid-cudi-moonmans-landing-cleveland-event-announcement",
      "urlToImage": "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2022%2F06%2Fkid-cudi-moonmans-landing-cleveland-event-announcement-tw.jpg?w=960&cbr=1&q=90&fit=max",
      "publishedAt": "2022-06-16T13:08:45Z",
      "content": "A new festival might just be making its way to Cleveland this Fall. Multi-hyphenate Kid Cudi has recently taken to social media to announce a new event that is coming to the city in September.\r\nIn a … [+1188 chars]"
    },
    {
      "source": {
        "id": null,
        "name": "Space.com"
      },
      "author": "andrew.w.jones@protonmail.com (Andrew Jones)",
      "title": "Water on the moon twice over for China's sample-return mission",
      "description": "China's Chang'e 5 lunar landing and sampling mission found water on the moon both through on-site analysis and in materials delivered to Earth.",
      "url": "https://www.space.com/china-moon-lander-water-detection",
      "urlToImage": "https://cdn.mos.cms.futurecdn.net/PdTZ7NUdABRedM9VJVXTbg-1200-80.jpg",
      "publishedAt": "2022-06-16T17:00:57Z",
      "content": "China's Chang'e 5 lunar landing and sampling mission found water on the moon both through on-site analysis and in materials delivered to Earth.\r\nThe daring Chang'e 5\r\n mission touched down on the moo… [+2528 chars]"
    }
  ]
} */
