import Header from './Header';

export default function Page(props) {
  return (
    <div>
      <Header />
      <h1>Im a Page</h1>
      {props.children}
    </div>
  );
}
