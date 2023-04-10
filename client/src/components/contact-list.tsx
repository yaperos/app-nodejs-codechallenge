import { Contact } from "../types";

interface ContactListProps extends Contact {
  onClick: () => void;
}

function ContactList({ name, phone, onClick }: ContactListProps) {
  return (
    <li
      className="py-3 px-3 cursor-pointer hover:bg-gray-100"
      role="button"
      onClick={onClick}
    >
      <div className="flex flex-col justify-start items-start">
        <p className="font-medium text-black">{name}</p>
        <p className="text-sm text-gray-500">{phone}</p>
      </div>
    </li>
  );
}

export default ContactList;
