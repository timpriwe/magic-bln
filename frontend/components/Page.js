import Header from './Header';

export default function Page(props) {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  );
}
