
import { Link } from 'react-router-dom';

interface EditButtonProps {
  to: {
    pathname: string;
  };
  title: string;
}


export default function EditButton({ to: { pathname }, title }: EditButtonProps) {

  return (
    <Link
      to={pathname}
      className="bg-white p-2 rounded-full shadow text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
      title={title}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
      </svg>
    </Link>
  );
}