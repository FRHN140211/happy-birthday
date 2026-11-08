export type PhotoAsset = {
  src: string;
  label: string;
  caption?: string;
};

import longshotSeoulCon from '../../longshot/260302 lngshot in 2025 SEOULCon Photo Behind 📸 © LNGSHOT.jpg';
import longshotDownload from '../../longshot/download.jpg';
import longshotRyul from '../../longshot/Lngshot Ryul.jpg';
import longshotOfficial from '../../longshot/LONGSHOT.jpg';
import longshotLouis from '../../longshot/Louis.jpg';

import cortisSeonghyeon from '../../cortis/CORTIS SEONGHYEON.jpg';
import cortisDownload from '../../cortis/download (1).jpg';
import cortisJames from '../../cortis/james.jpg';
import cortisMartin from '../../cortis/martin ★.jpg';
import cortisWallpaper from '../../cortis/wallpaper PC.jpg';

const kpopAssets = {
  longshot: [
    { src: longshotSeoulCon, label: 'SeoulCon behind photo', caption: 'SeoulCon behind' },
    { src: longshotDownload, label: 'LNGSHOT photo card', caption: 'LNGSHOT photo card' },
    { src: longshotRyul, label: 'Ryul', caption: 'Ryul' },
    { src: longshotOfficial, label: 'LONGSHOT', caption: 'LONGSHOT' },
    { src: longshotLouis, label: 'Louis', caption: 'Louis' },
  ] satisfies PhotoAsset[],
  cortis: [
    { src: cortisSeonghyeon, label: 'CORTIS SEONGHYEON', caption: 'CORTIS SEONGHYEON' },
    { src: cortisDownload, label: 'CORTIS photo card', caption: 'CORTIS photo card' },
    { src: cortisJames, label: 'james', caption: 'james' },
    { src: cortisMartin, label: 'martin ★', caption: 'martin ★' },
    { src: cortisWallpaper, label: 'wallpaper PC', caption: 'wallpaper PC' },
  ] satisfies PhotoAsset[],
};

export const birthdayContent = {
  name: 'Diva',
  displayName: 'Diva',
  birthdayDate: '08 NOVEMBER',
  openingTitle: 'For Diva',
  openingSubtitle: 'A little note, made just for you.',
  greetingTitle: 'Happy Birthday, Diva!',
  greetingSubtitle: 'Today is all yours.',
  letter: 'Happy birthday, Diva!\n\nWishing you a year of good health, steady progress, and a little more ease in everything you do.\n\nMay the plans you are working toward move smoothly, and may each step feel lighter than the last. Keep being the thoughtful, grounded person you are.\n\nEnjoy your day, Diva. Make it a good one!',
  wishes: [
    'Strong health to carry you through the year.',
    'Smooth steps in every plan you are building.',
    'Good company and a calm, steady rhythm.',
    'Clearer direction for the goals ahead.',
    'More small moments that feel like a breath of air.',
    'A quiet kind of peace in every season.',
  ],
  blessing: 'Here is to a year with steady energy, good plans, and more reasons to smile.',
  kpop: {
    lngshot: {
      name: 'LNGSHOT',
      tagline: 'LNGSHOT Collection',
      groupPhoto: kpopAssets.longshot[0].src,
      members: kpopAssets.longshot.slice(1),
    },
    cortis: {
      name: 'CORTIS',
      tagline: 'CORTIS Collection',
      groupPhoto: kpopAssets.cortis[0].src,
      members: kpopAssets.cortis.slice(1),
    },
  },
  gallery: [
    { src: '/assets/photos/photo-01.jpg', label: 'photo 01', caption: 'A good day worth keeping' },
    { src: '/assets/photos/photo-02.jpg', label: 'photo 02', caption: 'A quiet moment in between' },
    { src: '/assets/photos/photo-03.jpg', label: 'photo 03', caption: 'A smile worth holding onto' },
    { src: '/assets/photos/photo-04.jpg', label: 'photo 04', caption: 'A page from the story' },
    { src: '/assets/photos/photo-05.jpg', label: 'photo 05', caption: 'Small moments, still lovely' },
    { src: '/assets/photos/photo-06.jpg', label: 'photo 06', caption: 'More memories to come' },
  ] satisfies PhotoAsset[],
  music: {
    src: '',
    title: 'Birthday playlist',
  },
};
