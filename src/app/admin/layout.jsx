// The admin panel is private: keep it out of search results.
export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default function Layout({ children }) {
  return children;
}
