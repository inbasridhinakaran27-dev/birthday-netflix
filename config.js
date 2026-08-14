/**
 * Netflix Configuration Object
 * Easily customize the anniversary date, couple details, profile accounts, hero banner, content rows, and video playback.
 */
const NetflixConfig = {
  // 2nd Engagement Anniversary - Date of the engagement
  // Setting it to June 9, 2024 (so it is exactly 2 years as of June 9, 2026)
  engagementDate: "2024-06-09T00:00:00+05:30",

  coupleNames: {
    partner1: "Suba",
    partner2: "Ram"
  },

  // Custom video playback source (can be replaced with a path to a real video file like 'assets/our_story.mp4')
  videoSource: "assets/vid_01.mp4",
  videoThumbnail: "assets/img_16.jpg",

  // Profile cards for the Profile Selection Screen
  profiles: [
    {
      id: "started",
      name: "How It Started",
      image: "assets/img_10.jpg",
      tagline: "The spark that began it all..."
    },
    {
      id: "story",
      name: "Our Story",
      image: "assets/img_06.jpg",
      tagline: "A beautiful adventure of two hearts."
    },
    {
      id: "memories",
      name: "Favorite Memories",
      image: "assets/img_05.jpg",
      tagline: "Laughter, tears, and everything in between."
    },
    {
      id: "forever",
      name: "Forever Us",
      image: "assets/img_11.jpg",
      tagline: "Our promises, our dreams, our bond."
    },
    {
      id: "counting",
      name: "2 Years & Counting",
      image: "assets/img_08.jpg",
      tagline: "The best chapter is always the next one."
    }
  ],

  // Cinematic Hero banner content
  hero: {
    title: "Two Years of Love",
    subtitle: "A Netflix Original Series",
    description: "Every memory, every smile, every moment together has created a story more beautiful than any movie.",
    backgroundImage: "assets/img_19.jpg",
    matchPercentage: "100% Match",
    releaseYear: "2024",
    seasons: "2 Seasons",
    maturityRating: "PG-Love"
  },

  // Homepage content rows
  rows: [
    {
      id: "most-loved",
      title: "Most Loved Memories",
      cards: [
        {
          id: "day-we-met",
          title: "The Day We Met",
          image: "assets/img_16.jpg",
          duration: "2h 14m",
          rating: "Must Watch",
          description: "Where our paths crossed and the universe conspired to bring us together."
        },
        {
          id: "first-conv",
          title: "First Long Conversation",
          image: "assets/img_15.jpg",
          duration: "4h 45m",
          rating: "Highly Rated",
          description: "Hours felt like minutes as we talked about everything under the sun."
        },
        {
          id: "first-celebration",
          title: "First Celebration",
          image: "assets/img_07.jpg",
          duration: "1h 50m",
          rating: "Heartwarming",
          description: "Our first toast together. The beginning of many milestones."
        },
        {
          id: "laughter",
          title: "Unexpected Laughter",
          image: "assets/img_18.jpg",
          duration: "3h 10m",
          rating: "Comedy/Drama",
          description: "Those silly, unfiltered moments where we laughed until our stomachs hurt."
        },
        {
          id: "surprise",
          title: "Beautiful Surprise",
          image: "assets/img_21.jpg",
          duration: "2h 05m",
          rating: "Emotional",
          description: "A spontaneous moment that reminded us how magical love can be."
        },
        {
          id: "perfect-evening",
          title: "Perfect Evening",
          image: "assets/img_17.jpg",
          duration: "2h 40m",
          rating: "Classic",
          description: "Soft music, candlelight, and a quiet realization of forever."
        }
      ]
    },
    {
      id: "romantic-highlights",
      title: "Romantic Highlights",
      cards: [
        {
          id: "endless-smiles",
          title: "Endless Smiles",
          image: "assets/img_01.jpg",
          duration: "Ongoing",
          rating: "Feel Good",
          description: "The joy that lights up our faces whenever we look at each other."
        },
        {
          id: "safe-place",
          title: "My Safe Place",
          image: "assets/img_04.jpg",
          duration: "Infinite",
          rating: "Comforting",
          description: "In your arms, the chaotic world outside fades into complete peace."
        },
        {
          id: "sweetest-memories",
          title: "Sweetest Memories",
          image: "assets/img_02.jpg",
          duration: "1h 35m",
          rating: "Romantic",
          description: "A collage of whispers, stolen glances, and warm hugs."
        },
        {
          id: "together-always",
          title: "Together Always",
          image: "assets/img_08.jpg",
          duration: "24/7",
          rating: "Top Pick",
          description: "Facing every storm and celebrating every victory, hand in hand."
        },
        {
          id: "love-frame",
          title: "Love in Every Frame",
          image: "assets/img_03.jpg",
          duration: "3h 00m",
          rating: "Cinematic",
          description: "Capturing our happiest days in frozen slices of time."
        },
        {
          id: "favorite-person",
          title: "Favorite Person",
          image: "assets/img_20.jpg",
          duration: "Forever",
          rating: "Award Winning",
          description: "The star of my life's story, today and for all the days to come."
        }
      ]
    },
    {
      id: "future-seasons",
      title: "Our Future Seasons",
      cards: [
        {
          id: "new-adventures",
          title: "New Adventures",
          image: "assets/img_13.jpg",
          duration: "Coming Soon",
          rating: "Exciting",
          description: "Road trips, plane tickets, and undiscovered places waiting for us."
        },
        {
          id: "more-celebrations",
          title: "More Celebrations",
          image: "assets/img_22.jpg",
          duration: "Future Release",
          rating: "Festive",
          description: "More anniversaries, birthdays, promotions, and shared milestones."
        },
        {
          id: "dream-destinations",
          title: "Dream Destinations",
          image: "assets/img_24.jpg",
          duration: "Teaser",
          rating: "Aesthetic",
          description: "Strolling through historic streets and watching sunsets in foreign lands."
        },
        {
          id: "growing-together",
          title: "Growing Together",
          image: "assets/img_12.jpg",
          duration: "In Production",
          rating: "Inspiring",
          description: "Supporting each other's dreams and building our castle block by block."
        },
        {
          id: "forever-beyond",
          title: "Forever & Beyond",
          image: "assets/img_23.jpg",
          duration: "Infinity",
          rating: "Legendary",
          description: "An unbreakable bond that spans across time and space."
        },
        {
          id: "lifetime-together",
          title: "Lifetime Together",
          image: "assets/img_14.jpg",
          duration: "Lifetime",
          rating: "Masterpiece",
          description: "Growing old, holding wrinkled hands, and looking back on a life well-loved."
        }
      ]
    }
  ]
};
