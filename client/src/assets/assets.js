import brandMark from './pixora-mark.svg'
import logo_icon from './logo_icon.svg'
import facebook_icon from './facebook_icon.svg'
import instagram_icon from './instagram_icon.svg'
import twitter_x_icon from './twitter_x_icon.svg'
import discord_icon from './discord_icon.svg'
import avatarDefault from './avatar-default.svg'
import star_icon from './star_icon.svg'
import rating_star from './rating_star.svg'
import sample_img_1 from './sample_img_1.png'
import sample_img_2 from './sample_img_2.png'
import profile_img_1 from './profile_img_1.png'
import profile_img_2 from './profile_img_2.png'
import step_icon_1 from './step_icon_1.svg'
import step_icon_2 from './step_icon_2.svg'
import email_icon from './email_icon.svg'
import lock_icon from './lock_icon.svg'
import cross_icon from './cross_icon.svg'
import star_group from './star_group.png'
import credit_star from './credit_star.svg'
import profile_icon from './profile_icon.png'
import style_realistic from './style_realistic.png'
import style_anime from './style_anime.png'
import style_cyberpunk from './style_cyberpunk.png'
import style_fantasy from './style_fantasy.png'
import style_minimal from './style_minimal.png'
import home_mascot from './home-mascot.png'

export const assets = {
    brandMark,
    logo_icon,
    facebook_icon,
    instagram_icon,
    twitter_x_icon,
    discord_icon,
    avatarDefault,
    star_icon,
    rating_star,
    sample_img_1,
    sample_img_2,
    email_icon,
    lock_icon,
    cross_icon,
    star_group,
    credit_star,
    profile_icon,
    style_realistic,
    style_anime,
    style_cyberpunk,
    style_fantasy,
    style_minimal,
    home_mascot
}

export const stepsData = [
  {
    title: "Say what you’re after",
    description:
      "Type it the way you’d explain it to a friend: who’s there, lighting, palette, vibe. Tiny specifics usually beat “make it cool”.",
    icon: step_icon_1,
  },
  {
    title: "Pick a style, hit generate",
    description:
      "Realistic, anime, cyberpunk — pick one and go. Changing your mind afterwards is fine too. Tweaks inside the thread use Refine, not another full charge.",
    icon: step_icon_2,
  },
  {
    title: "Keep what sticks",
    description:
      "Download a PNG anytime, tuck favourites in My gallery, and reopen threads whenever you remember that one tweak you skipped.",
    icon: credit_star,
  },
];

export const testimonialsData = [
    {
        image:profile_img_1,
        name:'Donald Jackman',
        role:'Graphic Designer',
        stars:5,
        text:`I've been using bg.removal for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.`
    },
    {
        image:profile_img_2,
        name:'Richard Nelson',
        role:'Content Creator',
        stars:4,
        text:`I've been using bg.removal for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.`
    },
    {
        image:profile_img_1,
        name:'Donald Jackman',
        role:' Graphic Designer',
        stars:5,
        text:`I've been using bg.removal for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.`
    },
]

export const plans = [
    {
      id: 'Free',
      price: 0,
      credits: 10,
      desc: '10 credits every day. Private gallery + downloads.'
    },
    {
      id: 'Pro',
      price: 9,
      credits: 200,
      desc: 'More credits + priority generation (coming soon).'
    },
  ]