import MaleOne from '../assets/Avatars/male_one.png';
import MaleTwo from '../assets/Avatars/male_two.png';
import FemaleOne from '../assets/Avatars/female_one.png';
import FemaleTwo from '../assets/Avatars/female_two.png';
import { StaticImageData } from 'next/image';
export const avatars: { [key: string]: StaticImageData } = {
  MaleOne: MaleOne,
  MaleTwo: MaleTwo,
  FemaleOne: FemaleOne,
  FemaleTwo: FemaleTwo,
};

export const getAvatarFromLabel = (label: string) => {
  return avatars[label];
};
