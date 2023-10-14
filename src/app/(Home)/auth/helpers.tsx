import { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import Cookies from "universal-cookie"
import { Button } from "../../_components/Buttons/Buttons";

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const passwordRegex = /^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/
export const redirectRoute = '/dashboard'

type InputProps<T> = {
  label: string; value: string; onChange: Dispatch<SetStateAction<T>>;
  error: string | undefined; setError: Dispatch<SetStateAction<T>>
}

export const Input = <T extends object>({ label, value, onChange, error, setError }: InputProps<T>) => {
  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex max-sm:flex-col gap-2xl mb-2">
        <label className="max-sm:w-fit max-sm:p-1 w-[250px] p-2 font-bold border" htmlFor="">{toTitleCase(label)}</label>
        <input className=" max-sm:py-2 pl-2 w-full bg-blue-800/50 text-white border"
          placeholder={`Enter ${toTitleCase(label)}`}
          type={(label === 'password' || label === 'confirmPassword') ? 'password'
            : (label === 'email') ? 'email'
              : "text"} name={label} value={value} onChange={(e) => {
                const newVal = e.target.value;
                switch (label) {
                  case 'email':
                    setError((prevError) => {
                      return {
                        ...prevError,
                        [label]: !emailRegex.test(newVal) ? 'Invalid email format' : ''
                      }
                    })
                    break
                  case 'password':
                    setError((prevError) => {
                      return {
                        ...prevError,
                        [label]: !passwordRegex.test(newVal) ? 'Invalid password format. Must be alphanumeric with at least one symbol.' : ''
                      }
                    })
                    break
                  case 'confirmPassword':
                    setError((prevError) => {
                      return {
                        ...prevError,
                        [label]: !passwordRegex.test(newVal) ? 'Invalid password format. Must be alphanumeric with at least one symbol.' : ''
                      }
                    })
                    break
                  default:
                    setError((prevError) => {
                      return {
                        ...prevError,
                        [label]: !newVal ? 'Invalid entry. Field cannot be empty' : ''
                      }
                    })
                    break
                }
                onChange((prevState) => {
                  return {
                    ...prevState,
                    [label]: e.target.value
                  }
                })
              }} />

      </div>
    </>
  )
}

export const Form: React.FC<{ hideSubmit: () => boolean; children: ReactNode; title: string; handleSubmit: (e: FormEvent<HTMLFormElement>) => void }> = ({ hideSubmit, children, handleSubmit, title }) => {
  return (
    <form className="mx-2 sm:min-w-[500px]" onSubmit={(e) => handleSubmit(e)}>
      <h1 className="text-xl sm:text-6xl text-center font-bold">{title}</h1>
      <hr className="my-4 border" />
      {children}
      {!hideSubmit() && <Button styles="block mt-8" type='lg' onClick={() => { }}>Submit</Button>}
    </form>
  )
}

export const toTitleCase = (str: string) => {
  const strList = str.split('');
  let strCopy: string = ''
  strList.forEach((el, id) => {
    if (el.toUpperCase() === el) strCopy += ' '
    strCopy += el
  })
  const a = strCopy.split(' ');
  a.forEach((el, id) => {
    a[id] = el[0].toUpperCase() + el.slice(1)
  })
  return a.join(' ')
}

export const errorPresent = <E extends object>(error: E) => {
  let errorCounter = 0
  for (const v of Object.values(error)) {
    if (v) {
      errorCounter++
    }
  }
  return errorCounter !== 0
}


export const cookie = new Cookies(null, {
  // httpOnly: true,
  secure: true, // Set to true in production when using HTTPS
  // sameSite: 'strict', // Recommended for preventing CSRF
  maxAge: 3600000, // Cookie expiration time in milliseconds (1 hour)
  path: '/', // Specify the cookie's path as needed
})