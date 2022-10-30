/* Import all the font awesome goodness */
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas, faMoon, faSackDollar, faCloud } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faDiscord, faSteam, faGithub, faInstagram, faReddit, faTwitch, faSpotify, faPatreon } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faDiscord, faSteam, faGithub, faInstagram, faReddit, faTwitch, faSpotify, faMoon, faPatreon, faSackDollar, faCloud)
dom.watch()
