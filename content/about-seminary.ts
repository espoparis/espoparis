export const aboutSeminaryContent = {
  hero: {
    eyebrow: "About the seminary",
    title: "A seminary rooted in Paris and open to the wider Francophone world.",
    description:
      "Imam Center (AJ) - Paris exists to prepare students, preachers, and teachers who can serve France, Europe, Africa, and the wider French-speaking world with language fluency, sound religious grounding, and a contemporary sense of responsibility.",
  },
  overview: {
    eyebrow: "Mission and beginnings",
    title: "Why this seminary was established, and why its presence matters.",
    description:
      "The seminary was shaped around a clear conviction: in countries like France, where intellectual and cultural diversity is especially strong, religious learning must be present, accessible, and able to speak with clarity to the societies around it.",
    cards: [
      {
        title: "A needed responsibility",
        description:
          "For Muslim communities living in France and across Europe, serious religious learning cannot remain distant. The seminary was established as a local response to that responsibility, helping scholarship take root where people actually live, ask, teach, and serve.",
      },
      {
        title: "Established in Paris",
        description:
          "Shaykh Isma‘il al-Khaliq began teaching traditional seminary sciences in Paris in 2002, and by 2012 those study circles were formally organized under the name Imam Center (AJ) - Paris.",
      },
      {
        title: "Preparing future preachers",
        description:
          "The seminary seeks to prepare preachers and teachers from within Western societies themselves, especially those able to communicate in Western languages alongside Arabic.",
      },
      {
        title: "Distinct in its scope",
        description:
          "It stands out for combining traditional seminary study with a practical awareness of European, Western, African, and Francophone realities, while also teaching across several major languages.",
      },
    ],
  },
  gallery: {
    eyebrow: "A living seminary environment",
    title: "Study, teaching, and community in a more human frame.",
    description:
      "Beyond dates and institutions, the seminary is about the texture of learning itself: presence, discipline, guidance, discussion, and the steady shaping of people who will later teach and serve others.",
  },
  programs: {
    eyebrow: "Programs and curriculum",
    title: "Traditional study, adapted to the needs of students in Western societies.",
    description:
      "The Imam Center (AJ) - Paris follows the spirit of traditional seminary study while adapting delivery, access, and emphasis to the realities of students living in Europe and beyond.",
    tracks: [
      {
        title: "Religious educational courses",
        description:
          "A flexible, non-full-time track for people balancing work, family, or university while developing serious grounding in Islamic studies.",
        points: [
          "Covers Qur’an, jurisprudence, theology, ethics, biography, and history.",
          "Designed for students who need a sustainable rhythm alongside other responsibilities.",
          "Leads toward certifications that support teaching in Islamic schools and centers.",
        ],
      },
      {
        title: "Full-time seminary study",
        description:
          "A five-year intensive course of study based on a modified traditional curriculum for students seeking a more sustained seminary path.",
        points: [
          "Provides an organized route into deeper religious specialization.",
          "Offers introductory and intermediate formation that can prepare students for advanced study in Najaf al-Ashraf.",
          "Keeps the curriculum connected to the lived needs of contemporary communities.",
        ],
      },
    ],
    weekendSchools: {
      title: "Training teachers for weekend schools",
      description:
        "The center places special emphasis on preparing teachers for Saturday and Sunday Islamic schools across Western Muslim communities.",
      points: [
        "Mastery of teaching methods and classroom guidance.",
        "Understanding child and adolescent development.",
        "Developing impactful teaching skills for younger generations.",
      ],
    },
  },
  leadership: {
    eyebrow: "Founder, board, and teaching staff",
    title: "A seminary guided by long experience, scholarly formation, and wide service.",
    description:
      "The seminary draws strength from scholars whose experience spans the traditional centers of learning as well as decades of teaching, da‘wa, and community work across multiple countries.",
    founder: {
      title: "About the founder",
      paragraphs: [
        "Ayatollah Shaykh Isma‘il al-Khaliq was raised near the shrine of Imam Husayn (peace be upon him), began seminary studies early in Karbala, and continued them in Najaf under leading scholars including Sayyid al-Khoei and Sayyid al-Rouhani.",
        "Alongside his advanced religious training, he completed a master’s degree at the Arab University in Beirut and later served in Iraq, Iran, Pakistan, Syria, Lebanon, France, Canada, and the United Kingdom.",
        "He is regarded as one of the leading Shi‘a scholars in the West, bringing together deep seminary formation, wide missionary experience, and a readiness to engage different cultures with openness and seriousness.",
      ],
    },
    advisoryBoard: {
      title: "Scientific advisory board",
      members: [
        "Dr. Shaykh Yusuf Muhammad ‘Amr (Lebanon)",
        "Dr. Muhammad رضا al-Turayhi (Netherlands)",
        "Dr. ‘Abd al-Amir Zahid (Iraq)",
      ],
    },
    faculty: {
      title: "Teaching staff",
      members: [
        "Shaykh Dr. Mustafa al-Khaliq",
        "Shaykh ‘Abdullah Shami Zadeh",
        "Shaykh Isma‘il al-Kanawi",
        "Shaykh Dr. Fares al-Khatib",
        "Shaykh Abu Fatima al-Camerooni",
        "Shaykh Mujtaba al-Khaliq",
        "Shaykh Hasan al-Nasiri",
      ],
    },
  },
  network: {
    eyebrow: "Affiliated institutes and wider reach",
    title: "Paris is one center within a broader educational network.",
    description:
      "The seminary’s work does not stop at Paris. It also supports affiliated institutes and educational efforts across Africa and other regions connected to its mission.",
    institutes: [
      {
        country: "Nigeria",
        institute: "Imam al-Sadiq Seminary (Kano)",
      },
      {
        country: "Tanzania",
        institute: "al-Sadiq al-Amin Institute",
      },
      {
        country: "Cameroon",
        institute: "Lady Fatima (al-Zahra) Center",
      },
      {
        country: "Mauritania",
        institute: "The first Shi‘a seminary in Nouakchott",
      },
    ],
    note:
      "The center also supports activities in Belgium and Mali, reflecting a wider educational and missionary reach beyond France itself.",
  },
} as const;

export type AboutSeminaryContent = typeof aboutSeminaryContent;
