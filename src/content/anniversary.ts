import type { AnniversaryContent } from "@/types/content";

/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT ME. Every word on the site comes from this file.
 *
 *  • Nothing here invents facts beyond the dates you gave me. Where
 *    a detail was unknown, the copy stays general on purpose.
 *  • Photos are referenced by id (see src/content/photos.ts).
 * ─────────────────────────────────────────────────────────────
 */
export const content: AnniversaryContent = {
  her: "Neela",
  him: "Sajan",
  timeZone: "Asia/Kathmandu",
  weddingDate: "2024-11-21",
  anniversaryDate: "2026-11-21",

  opening: {
    kicker: "To my favorite person.",
    line: "Neela, I made something for us.",
    button: "Open our story",
    // Appears only on 21 November (Nepal time), every year, with a petal shower.
    // Preview it any day by adding ?anniversary to the URL.
    anniversaryGreeting: "Happy {nth} anniversary, Nuga.",
  },

  title: {
    heading: "Two years. One forever.",
    subtitle: "Two years ago, we chose each other. Every day since, I would choose you again.",
    // Wide photo on laptops, tall photo on phones (faces stay clear of the title).
    photo: "by-the-water",
    photoMobile: "portrait-together",
    alt: "Sajan and Neela holding each other close in their wedding photoshoot.",
  },

  stranger: {
    eyebrow: "Prologue · October 2022",
    headline: "Once upon a time, you were a stranger.",
    intro:
      "October 2022. Two strangers on Snapchat, one message, and no idea we had just started forever. Watch what happened to that word.",
    sender: "New message from",
    // Each step strikes out the last. Edit freely; the last one stays on screen.
    // "October 2022" comes from counting 1,504 days back from 20 Nov 2026 (= 8 Oct 2022).
    steps: [
      // `photo` is the picture inside the message at that moment of the story.
      { label: "a stranger", note: "October 2022", photo: "her-mountains-2" },
      { label: "someone I couldn't stop talking to", note: "", photo: "her-mountains-1" },
      { label: "my first date", note: "10 June 2023", photo: "first-date-hands" },
      { label: "my favourite person", note: "", photo: "laughing" },
      { label: "my fiancée", note: "12 October 2024", photo: "bride-to-be" },
      { label: "my wife", note: "21 November 2024", photo: "wedding-garlands" },
    ],
    outro: "Look at us now.",
    replay: "Watch it again",
  },

  mountains: {
    eyebrow: "A confession",
    headline: "You sent me mountains.",
    body: [
      "You sent me mountains on Snapchat. I'm a mountain guy, so I saved them, and posted them. Without asking.",
    ],
    prints: [
      { photo: "her-mountains-1", title: "Photograph by Neela", credit: "" },
      { photo: "her-mountains-2", title: "Also by Neela", credit: "I like her photography." },
    ],
    apology: "Sorry. Not sorry.",
    payoff: {
      photo: "mountain-silhouette",
      eyebrow: "And now",
      line: "Now we look at the mountains together.",
      text: "No phone, no screen. Just you, right next to me.",
    },
  },

  polaroids: {
    eyebrow: "Pick one up",
    headline: "A table full of us.",
    hintFine: "Drag them around. Click one to turn it over.",
    hintCoarse: "Tap a photo to turn it over.",
    items: [
      {
        photo: "laughing",
        label: "That laugh",
        note: "I would do anything to hear this every day.",
      },
      { photo: "bike-ride", label: "Road trips", note: "Hold on tight. I've got you." },
      {
        photo: "playful-walk",
        label: "Wait for me",
        note: "Always a step ahead. I'll always follow.",
      },
      { photo: "cozy-selfie", label: "Just us", note: "My favourite place is next to you." },
      {
        photo: "carved-window",
        label: "Our window",
        note: "Looking out at the whole world, with you.",
      },
      { photo: "twirl", label: "Spin with me", note: "Spin with me. Always." },
      { photo: "her-glance", label: "That look", note: "This look. Every single time." },
      { photo: "cartoon-us", label: "Cartoon us", note: "Still cute as cartoons." },
    ],
  },

  beginning: {
    headline: "Somehow, in this enormous world, I found you.",
    intro:
      "Every love story is ordinary to everyone except the two people inside it. This is ours.",
    chapters: [
      {
        id: "met",
        eyebrow: "How we met · October 2022",
        title: "Strangers, at first",
        body: [
          "In October 2022, you were just a name on my screen. A stranger on Snapchat. One snap turned into a chat, and that chat became my favourite part of the day. I didn't know it then, but I was talking to the girl who would become my whole world.",
        ],
        photo: "her-mountains-1",
        inset: "holding-hands",
      },
      {
        id: "first-date",
        eyebrow: "10 June 2023",
        title: "Our first date",
        body: [
          "After months of messages, there you were, right in front of me. No screen between us. You were a little shy, I was a little nervous, and I couldn't stop looking at you.",
          "I still remember the taste of the cone pizza we shared that day. That was the day the stranger from my phone became someone I never wanted to let go of.",
        ],
        photo: "first-date-hands",
      },
      {
        id: "knew",
        eyebrow: "The moment I knew",
        title: "It was a look",
        body: [
          "It wasn't loud or dramatic. It was the way you looked at me, the kind of look that makes everything else go quiet. That was when I knew you weren't just someone special. You were the one.",
        ],
        photo: "her-glance",
      },
      {
        id: "engagement",
        eyebrow: "12 October 2024",
        title: "Two families, one promise",
        body: [
          "With both our families around us, we made it official. That day two families became one, and the future suddenly had a shape. It looked like you.",
        ],
      },
      {
        id: "wedding",
        eyebrow: "21 November 2024 · Nepal",
        title: "Forever, out loud",
        body: [
          "In Nepal, in front of everyone we love, wrapped in garlands, music and blessings, we promised each other a whole life. I meant every word. I mean it even more today.",
        ],
        photo: "wedding-day",
      },
      {
        id: "favorites",
        eyebrow: "Since then",
        title: "A thousand small adventures",
        body: [
          "Old streets and new places, laughing at nothing, and far too many selfies. Every day since, we have grown a little closer and a little stronger. These are the days I want to keep forever.",
        ],
        photo: "bike-ride",
      },
    ],
  },

  timeline: {
    headline: "Two years of us",
    intro: "And the two years before that. Some dates the world will never remember. We will.",
    events: [
      {
        id: "met",
        date: null,
        label: "October 2022",
        title: "Two strangers on Snapchat",
        story:
          "A photo of the mountains from someone I didn't know yet. I had no idea I'd just said hello to the love of my life.",
        photo: "her-mountains-1",
      },
      {
        id: "first-date",
        date: "2023-06-10",
        title: "Our first date",
        story:
          "The girl behind all those messages, finally across the table from me. Cone pizza, shy smiles, and your hand in mine.",
        photo: "first-date-cafe",
      },
      {
        id: "growing",
        date: null,
        label: "2023 – 2024",
        title: "Growing stronger",
        story:
          "Every call, every visit, every ordinary day. Somewhere in there, \u201cyou and me\u201d quietly became \u201cus\u201d.",
        photo: "laughing",
      },
      {
        id: "engagement",
        date: "2024-10-12",
        title: "Our engagement",
        story: "Celebrated with both our families. One question, one yes, and everything changed.",
      },
      {
        id: "bride-to-be",
        date: null,
        label: "Just before the wedding",
        title: "Bride to be",
        story:
          "Balloons, cake, a sash that said \u201cbride\u201d, and the happiest girl in the room. A few more days, and you'd be mine.",
        photo: "bride-to-be",
      },
      {
        id: "wedding",
        date: "2024-11-21",
        title: "Married",
        story: "The day your hand found its place in mine, for good.",
        photo: "wedding-garlands",
        highlight: true,
      },
      {
        id: "travels",
        date: null,
        label: "Along the way",
        title: "Wherever the road goes",
        story:
          "Your arms around me on the back of the bike, and no plan except to keep going. Every new place is better with you in it.",
        photo: "bike-ride",
      },
      {
        id: "places",
        date: null,
        label: "New places, same us",
        title: "Old streets, new memories",
        story:
          "Temple squares, carved windows, crowded streets. You always a step ahead, me always following.",
        photo: "playful-walk",
      },
      {
        id: "second",
        date: "2026-11-21",
        title: "Our second anniversary",
        story:
          "Four years since a stranger said hello. Two years since I first called you my wife. My Nuga, I would live every single day of it again.",
        photo: "embrace",
        highlight: true,
      },
    ],
  },

  gallery: {
    headline: "Moments we kept",
    intro: "Tap a photo to see it full size.",
    photos: [
      "portrait-together",
      "by-the-water",
      "her-glance",
      "the-bell",
      "twirl",
      "pavilion",
      "golden-door",
      "stairs-portrait",
      "temple-sky",
      "embrace",
      "neela-walking",
      "selfie",
      "sajan",
      "wedding-day",
      "ring",
      "holding-hands",
      "stairs",
      "cartoon-us",
      "mountain-silhouette",
      "laughing",
      "first-date-cafe",
      "bike-ride",
      "carved-window",
      "wedding-garlands",
      "first-date-hands",
      "bride-to-be",
      "playful-walk",
      "cozy-selfie",
    ],
  },

  littleThings: {
    headline: "Things I hope you never forget.",
    intro: "Small things, mostly. The kind I notice every day and almost never say.",
    items: [
      {
        id: "smile",
        title: "Your smile",
        message:
          "The way it starts in your eyes before it reaches your lips. I would do almost anything to see it.",
        photo: "laughing",
      },
      {
        id: "ordinary",
        title: "How you make ordinary days special",
        message:
          "With you, an errand becomes an adventure and a quiet evening becomes a memory. You make the everyday count.",
        photo: "selfie",
      },
      {
        id: "kindness",
        title: "Your kindness",
        message:
          "You are kind when nobody is watching, and especially when it would be easier not to be. It makes me want to be better.",
        photo: "neela-walking",
      },
      {
        id: "voice",
        title: "Your voice",
        message:
          "Some days, hearing you say my name is the best part of the day. I would know your voice anywhere.",
        photo: "temple-sky",
      },
      {
        id: "strength",
        title: "Your strength",
        message:
          "You carry so much and complain so little. I see it, every time. You are stronger than you know.",
        photo: "golden-door",
      },
      {
        id: "home",
        title: "How you make a place feel like home",
        message: "Home stopped being an address a long time ago. It is wherever you are.",
        photo: "pavilion",
      },
      {
        id: "king",
        title: "How you take care of me",
        message:
          "You are always trying to make me happy. You have stood beside me through every obstacle I have ever faced, and you treat me like a king. I hope I make you feel like my queen, every single day.",
        photo: "portrait-together",
      },
      {
        id: "only-me",
        title: "The little things only I notice",
        message:
          "The tiny habits you probably don't know you have. I notice all of them. I keep a list in my head, and it only keeps growing.",
        photo: "holding-hands",
      },
    ],
  },

  letter: {
    title: "To my wife. My home. My forever.",
    salutation: "Dear Nuga,",
    paragraphs: [
      "Two years. I keep saying it to myself because it still doesn't quite feel real. Two years since we stood side by side, garlands around our necks, and promised each other a whole life. I still don't fully understand how I got this lucky.",
      "Sometimes I think about how it started: a stranger on my screen in October 2022, and a first date on 10 June 2023 that I didn't want to end. If someone had told me then that you would one day be my wife, I would have smiled and hoped they were right. They were.",
      "We have made so many memories already. Some of them are in the photographs on this page. Most of them aren't. They live in the small hours, the long conversations, the jokes nobody else would understand, and the quiet moments when nothing was happening and everything was fine, because you were there.",
      "I know these two years haven't always been easy. There were days when the distance between us felt bigger than anything I could say through a phone. There were sacrifices, and some of them you made without ever telling me what they cost you. I noticed. I am grateful for every one of them, and I don't take a single one for granted.",
      "Being this far from you is the hardest part of loving you. I miss you every single day, Nuga. I miss exploring new places with you. I miss fighting you for the last piece of momo, and quietly stealing your share of keema noodles and laphing when you weren't looking. I miss every slice of pizza we ever shared. But most of all I miss the simple things: sitting next to you, hearing you laugh, just spending time with you. Every day without you only reminds me how much of my heart you are.",
      "You are the first person I want to tell everything to: the good news, the bad days, the silly thing I saw on the way home. When I picture the future now, I don't picture places or things. I picture you in it, and that is enough for me.",
      "Thank you for choosing me. For your patience, your laughter, and for loving me on the days I was hard to love. I promise to keep choosing you, on the easy days and especially on the hard ones.",
      "Soon we'll be back to stolen bites and the last momo, and I promise to let you win. Sometimes. Here's to everything we are still going to build. I can't wait for all of it.",
    ],
    closing: "Forever yours,",
    signature: "Sajan",
    photo: "portrait-together",
  },

  bouquet: {
    eyebrow: "A little something",
    headline: "I can't hand you flowers today.",
    text: "So I made you some that will never wilt. Sunflowers, because they always turn toward the light, the way I always turn toward you.",
    hint: "Tap the bouquet",
    afterTap: "They're yours, Nuga. So am I.",
    tag: "For Nuga",
    tagNote: "Happy 2nd anniversary",
    alt: "An illustrated bouquet of twelve sunflowers wrapped in kraft paper, tied with a wine-coloured ribbon, with a tag that reads For Nuga.",
  },

  future: {
    headline: "Still so much life to live together.",
    intro: "This is only the beginning. Here is what I'm looking forward to.",
    dreams: [
      {
        id: "places",
        title: "Places we'll see",
        text: "More mountains, obviously. Sunrises from every viewpoint we can reach, cities we can't pronounce yet, and somewhere by the sea with nothing on the schedule.",
      },
      {
        id: "experiences",
        title: "Things we'll do",
        text: "Cook something ambitious and fail together. Dance badly in the kitchen. Learn something new, side by side.",
      },
      {
        id: "home",
        title: "Our future home",
        text: "A home with your things all over it, good light, too many plants, and a door I'll always be glad to come back to.",
      },
      {
        id: "ordinary",
        title: "Ordinary days",
        text: "Slow mornings, shared tea, doing nothing in particular together, and calling it a perfect day.",
      },
      {
        id: "celebrations",
        title: "Every celebration to come",
        text: "Every anniversary, every birthday, every win, big or small. I want to be the one cheering loudest.",
      },
      {
        id: "old",
        title: "Growing old together",
        text: "Grey hair, the same old jokes, and still holding hands on the way home. That's the dream.",
      },
    ],
    countdown: {
      // Set to the wall-clock time of your next reunion, e.g. "2027-01-15T18:00".
      // While null, the countdown stays hidden.
      target: null,
      timeZone: "Asia/Kathmandu",
      label: "Until I'm holding you again",
    },
    photo: "stairs",
    photoMobile: "stairs-portrait",
  },

  wish: {
    eyebrow: "Make a wish",
    headline: "Close your eyes. Make a wish.",
    text: "Big, small, silly or serious. Type it here and it comes straight to me. I'll spend my life trying to make it come true.",
    label: "Your wish",
    placeholder: "I wish…",
    button: "Send my wish",
    sending: "Sending it to the sky…",
    sentHeadline: "Your wish is on its way.",
    sentText: "It just reached me. Consider it my next promise.",
    error: "It didn't send. Check your connection and try again.",
  },

  finale: {
    lines: [
      "From a stranger on my screen…",
      "After everything.",
      "Through everything.",
      "In every version of the future…",
    ],
    choose: "I would still choose you.",
    buttonLabel: "One last thing…",
    message: [
      "Happy second anniversary, my love.",
      "Two years down. A lifetime to go.",
      "I love you, Neela.",
      "Always.",
    ],
    signature: "Sajan",
    photo: "twirl",
  },

  music: {
    // Put a file at /public/audio/our-song.mp3 and set src to "/audio/our-song.mp3".
    src: null,
    title: "Our song",
  },

  footer: "Made with all my love, for Neela · 21 November 2026",
};
