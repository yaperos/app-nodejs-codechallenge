import { useState, useEffect } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import yapeLogo from "./assets/Logo.Yape.webp";
import "./App.css";
import { Contact, Transaction } from "./types";
import ContactList from "./components/contact-list";
import TransactionForm from "./components/transaction-form";
import Receipt from "./components/receipt";

const contacts: Contact[] = [
  {
    id: "1",
    name: "Alastor Moody",
    phone: "982828178",
  },
  {
    id: "2",
    name: "Bilbo Baggins",
    phone: "926273456",
  },
  {
    id: "3",
    name: "Billy Jean",
    phone: "923453657",
  },
  {
    id: "4",
    name: "Ted Mosby",
    phone: "987234567",
  },
];

const GET_TRANSACTION = gql`
  query TransactionById($id: String!) {
    transactionById(id: $id) {
      id
      value
      transactionStatus {
        name
      }
      createdAt
    }
  }
`;

function App() {
  const [step, setStep] = useState<{
    id: 1 | 2 | 3;
    payload?: Transaction;
    result?: "success" | "error";
  }>({
    id: 1,
  });
  const [getTransaction] = useLazyQuery(GET_TRANSACTION, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (step.id !== 3) return;

    const interval = setInterval(() => {
      queryTransaction(step.payload!.id!);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [step.id]);

  const handleSelectContact = (contactId: string) => () => {
    const contactSelected = contacts.find((v) => v.id === contactId);

    setStep({
      id: 2,
      payload: {
        value: 0,
        contact: contactSelected,
      },
    });
  };

  const handleSuccess = (transaction: Transaction) => {
    setStep({
      id: 3,
      payload: {
        contact: step.payload?.contact,
        ...transaction,
      },
    });
  };

  const queryTransaction = async (id: string) => {
    const { data, error } = await getTransaction({
      variables: {
        id,
      },
    });

    if (error) console.error(error);

    setStep({
      id: 3,
      payload: {
        contact: step.payload?.contact,
        ...data.transactionById,
      },
    });
  };

  const backToContacts = () => {
    setStep({
      id: 1,
    });
  };

  const currentStep = () => {
    if (step.id === 1) {
      return (
        <div className="w-3/6 mt-32">
          <h1 className="text-white text-left">
            Selecciona al contacto que desees yapear
          </h1>
          <div className="w-full bg-white mt-4 rounded">
            <ul className="divide-y divide-gray-400">
              {contacts.map((v) => (
                <ContactList
                  key={v.id}
                  onClick={handleSelectContact(v.id)}
                  {...v}
                />
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (step.id === 2) {
      return (
        <div className="w-2/6 mt-32">
          <div className="flex w-full">
            <p
              className="text-2xl text-white cursor-pointer"
              role="button"
              onClick={backToContacts}
            >
              {"<"}
            </p>
            <h1 className="flex-1 text-white text-2xl">
              {step.payload!.contact!.name}
            </h1>
          </div>
          <TransactionForm onSuccess={handleSuccess} />
        </div>
      );
    }

    if (step.id === 3) {
      return (
        <div className="w-3/6 mt-32">
          <div className="flex flex-col items-center w-full">
            <Receipt transaction={step.payload!} />
            <p
              className="text-2xl text-white cursor-pointer mt-4"
              role="button"
              onClick={backToContacts}
            >
              X
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App flex flex-col items-center">
      <header className="w-full flex justify-center">
        <img src={yapeLogo} className="logo" alt="Yape logo" />
      </header>
      {currentStep()}
    </div>
  );
}

export default App;
