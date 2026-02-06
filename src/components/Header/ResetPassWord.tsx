import React, { useEffect } from 'react'
import { Header } from '../Header'
import { InputField } from '../../common/InputField'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiAxios } from '../../commonapicall/api/apiUrl';

const resetPasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Old password is required'),
    new_password: z.string().min(6, 'New password must be at least 6 characters'),
    confirm_password: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;


export const ResetPassWord: React.FC = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setMessage('');
    setError('');
    try {
      const response = await apiAxios.post('/api/reset-password/', data);
      setMessage(response.data.message);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed');
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [message]);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  return (
    <div className=' min-h-screen bg-gray-100'>
      <Header />

      <div className='flex justify-center items-center min-h-[calc(100vh-74px)]'>


        <div className=' bg-white p-6 mt-6 shadow-md rounded-md  mx-auto max-w-xl'>
          <div>
            <div className='p-1'>
              <h1 className='text-2xl font-bold text-center'>Reset Password</h1>

              <form onSubmit={handleSubmit(onSubmit)} >


                {message && <p className="text-green-600 text-center mt-2">{message}</p>}
                {error && <p className="text-red-600 text-center mt-2">{error}</p>}


                <div className='flex flex-col mt-3'>
                  <div className='flex justify-center'>
                    <div className='min-w-[200px]'>
                      <label className='block text-sm font-medium text-gray-700'>Old password<span className='text-red-500'>*</span></label>
                      <InputField
                        type="text"
                        className="mt-1 block w-md  border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                        label=""
                        {...register("old_password")}
                      />
                      {errors.old_password && <p className='text-red-500'>{errors.old_password.message}</p>}
                    </div>
                  </div>

                  <div className='flex justify-center'>
                    <div className='min-w-[200px]'>
                      <label className='block text-sm font-medium text-gray-700'>New Password<span className='text-red-500'>*</span></label>
                      <InputField
                        type="text"
                        className="mt-1 block w-md border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                        label=""
                        {...register("new_password")}
                      />
                      {errors.new_password && <p className='text-red-500'>{errors.new_password.message}</p>}
                    </div>
                  </div>

                  <div className='flex justify-center'>
                    <div className='min-w-[200px]'>
                      <label className='block text-sm font-medium text-gray-700'>Confirm password<span className='text-red-500'>*</span></label>
                      <InputField
                        type="text"
                        className="mt-1 block w-md border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                        label=""
                        {...register("confirm_password")}
                      />
                      {errors.confirm_password && <p className='text-red-500'>{errors.confirm_password.message}</p>}
                    </div>

                  </div>



                  <div className='flex justify-center mt-3'>
                    <div className='min-w-[200px]'>
                      <button
                        className=" flex mt-1 items-center gap-2 bg-main text-white border border-main rounded px-4 py-2 font-bold hover:text-main hover:bg-white transition-colors duration-200 cursor-pointer"
                        type='submit'
                      >Reset Password</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
