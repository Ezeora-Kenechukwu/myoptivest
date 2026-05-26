import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
export default function StepOne({ data, setData, errors, disabled }) {
  return (
       <div className=' my-5 '>
            <h1 className="text-[#0A0A0C] font-rubik font-semibold text-[24px] leading-[100%] tracking-[1%] my-4 max-w-lg">What is the primary purpose of using Optivest?</h1>
            <h1 className='text-[#101928] text-md font-rubik font-medium text-md max-w-lg '>We’ll get you started with personalized recommendations based on your focus</h1>

            <div className='flex flex-col gap-4 mt-5'>
                <label className={`flex items-center px-5 gap-6  h-[61px] rounded-[9px]   ${data.reason == 'Sole Investment' ? 'border-[#4C44DB] border-2' : 'border-[#00000045] border-[0.3px] '}`} htmlFor='Sole Investment'>
                <Checkbox checked={data.reason == 'Sole Investment'} className='rounded-full data-[state=checked]:bg-transparent data-[state=checked]:text-[#4C44DB] data-[state=checked]:border-[#4C44DB] checked:border-[#4C44DB] checked:text-[#4C44DB]'  id="Sole Investment" value="Sole Investment" name="reason" onClick={(e) =>  setData('reason', data.reason == "Sole Investment" ? '': e.target.value)      } />
                  Sole Investment
            </label>
            <label className={`flex items-center px-5 gap-6  h-[61px] rounded-[9px]   ${data.reason == 'Company Investment' ? 'border-[#4C44DB] border-2' : 'border-[#00000045] border-[0.3px] '}`} htmlFor='Company Investment'>
                <Checkbox checked={data.reason == 'Company Investment'} className='rounded-full data-[state=checked]:bg-transparent data-[state=checked]:text-[#4C44DB] data-[state=checked]:border-[#4C44DB] checked:border-[#4C44DB] checked:text-[#4C44DB]'  id="Company Investment" value="Company Investment" name="reason" onClick={(e) =>  setData('reason', data.reason == "Company Investment" ? '': e.target.value)      } />
                    Company Investment
                         </label>
            <label className={`flex items-center px-5 gap-6  h-[61px] rounded-[9px]   ${data.reason == 'Group Investment' ? 'border-[#4C44DB] border-2' : 'border-[#00000045] border-[0.3px] '}`} htmlFor='Group Investment'>
                <Checkbox checked={data.reason == 'Group Investment'} className='rounded-full data-[state=checked]:bg-transparent data-[state=checked]:text-[#4C44DB] data-[state=checked]:border-[#4C44DB] checked:border-[#4C44DB] checked:text-[#4C44DB]'  id="Group Investment" value="Group Investment" name="reason" onClick={(e) =>  setData('reason', data.reason == "Group Investment" ? '': e.target.value)      } />

                    <p className={`flex items-center gap-2    ${data.reason == 'Group Investment' ? 'text-[#4C44DB]' : 'text-[#585858]  '}`}>
                        {/* <FcMoneyTransfer size={30} /> */}
                        Group Investment</p>
            </label>
            <label className={`flex items-center px-5 gap-6  h-[61px] rounded-[9px]   ${data.reason == 'Other' ? 'border-[#4C44DB] border-2' : 'border-[#00000045] border-[0.3px] '}`} htmlFor='Other'>
                <Checkbox checked={data.reason == 'Other'} className='rounded-full data-[state=checked]:bg-transparent data-[state=checked]:text-[#4C44DB] data-[state=checked]:border-[#4C44DB] checked:border-[#4C44DB] checked:text-[#4C44DB]'  id="Other" value="Other" name="reason" onClick={(e) =>  setData('reason', data.reason == "Other" ? '': e.target.value)      } />

                    <p className={`flex items-center gap-2    ${data.reason == 'Other' ? 'text-[#4C44DB]' : 'text-[#585858]  '}`}>
                        {/* <FaCcMastercard size={30} /> */}
                        Other</p>
            </label>
            </div>

        </div>
  );
}
