// Real sponsorship results, taken from the academy's "Congratulations" posters in /public/images.
// `photo` is the portrait cropped from the poster; `poster` is the full poster.
const poster = (n) => `/images/pacifc-sporands-photos-24-${n}.jpeg`;
const photo = (slug) => `/images/cadets/${slug}.jpg`;

export const sponsoredCadets = [
  { id: 'nahar-jogani', name: 'Nahar Jogani', company: 'Great Eastern', photo: photo('nahar-jogani'), poster: poster(16) },
  { id: 'chirag-sharma', name: 'Chirag Sharma', company: 'PIL & SCI', photo: photo('chirag-sharma'), poster: poster(15) },
  { id: 'tanvi-shekhawat', name: 'Tanvi Shekhawat', company: 'Great Eastern', photo: photo('tanvi-shekhawat'), poster: poster(14) },
  { id: 'jayant-choudhary', name: 'Jayant Choudhary', company: 'Seven Island', photo: photo('jayant-choudhary'), poster: poster(13) },
  { id: 'gourav-rathore', name: 'Gourav Rathore', company: 'Scorpio Tankers', photo: photo('gourav-rathore'), poster: poster(11) },
  { id: 'balwant-singh', name: 'Balwant Singh', company: 'MSC', photo: photo('balwant-singh'), poster: poster(10) },
  { id: 'yashdev-tripathi', name: 'Yashdev Tripathi', company: 'MSC', photo: photo('yashdev-tripathi'), poster: poster(9) },
  { id: 'ravi', name: 'Ravi', company: 'Torm Tankers', photo: photo('ravi'), poster: poster(8) },
];

// One poster congratulates seven cadets together, so it is shown as a group.
export const sponsoredGroup = {
  company: 'Synergy',
  names: ['Shakshi Divedi', 'Gavish Vijayvargiya', 'Eden Eldo', 'Kavya', 'Vidusi Gupta', 'Ravi', 'Niranjan'],
  photo: '/images/cadets/synergy-group.jpg',
  poster: poster(12),
};
