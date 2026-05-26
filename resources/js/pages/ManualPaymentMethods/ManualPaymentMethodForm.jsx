import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import FileUpload from "@/components/FileUpload";
import { useForm } from "@inertiajs/react";

export default function ManualPaymentMethodForm({ method = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: method?.name || "",
        type: method?.type || "bank_transfer", // default to bank_transfer
        instructions: method?.instructions || "Please pay into the account provided below and ensure you upload a valid proof of payment. Your transaction will be verified before confirmation.",
        account_name: method?.account_name || "",
        account_number: method?.account_number || "",
        bank_name: method?.bank_name || "",
        wallet_address: method?.wallet_address || "",
        icon: method?.icon || null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (method) {
            post(route("manual-payment-methods.update", method.id));
        } else {
            post(route("manual-payment-methods.store"));
        }
    };

    return (
        <div className="p-6 shadow-lg rounded-xl w-full max-w-3xl mx-auto text-slate-800 dark:text-slate-100">
            <h2 className="text-2xl font-bold mb-2">
                {method ? "Edit Manual Payment Method" : "Create Manual Payment Method"}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
                Fill in the details below based on the selected payment type. For <strong>Bank Transfer</strong>, you’ll need account details. For <strong>Crypto</strong>, a wallet address and icon are required.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <TextInput
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                          className="w-full py-3 px-5 BORDER"
                    />
                    <InputError message={errors.name} />
                </div>

                {/* Type */}
                <div>
                    <InputLabel htmlFor="type">Payment Type</InputLabel>
                    <select
                        id="type"
                        value={data.type}
                        onChange={(e) => setData("type", e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:bg-slate-700 dark:text-white py-3 px-5 border"
                    >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="crypto">Crypto</option>
                    </select>
                    <InputError message={errors.type} />
                </div>

                {/* Instructions */}
                <div>
                    <InputLabel htmlFor="instructions">Instructions</InputLabel>
                    <TextArea
                        value={data.instructions}
                        onChange={(e) => setData("instructions", e.target.value)}
                          className="w-full py-3 px-5 BORDER"
                        rows={4}
                    />
                    <InputError message={errors.instructions} />
                </div>

                {/* Bank Transfer Fields */}
                {data.type === "bank_transfer" && (
                    <div className="border-t pt-4  flex flex-col gap-4">
                        <h3 className="font-semibold text-lg mb-2 text-slate-500">Bank Account Details</h3>

                        <div>
                            <InputLabel htmlFor="account_name">Account Name</InputLabel>
                            <TextInput
                                type="text"
                                value={data.account_name}
                                onChange={(e) => setData("account_name", e.target.value)}
                                  className="w-full py-3 px-5 BORDER"
                            />
                            <InputError message={errors.account_name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="account_number">Account Number</InputLabel>
                            <TextInput
                                type="text"
                                value={data.account_number}
                                onChange={(e) => setData("account_number", e.target.value)}
                                  className="w-full py-3 px-5 BORDER"
                            />
                            <InputError message={errors.account_number} />
                        </div>

                        <div>
                            <InputLabel htmlFor="bank_name">Bank Name</InputLabel>
                            <TextInput
                                type="text"
                                value={data.bank_name}
                                onChange={(e) => setData("bank_name", e.target.value)}
                                  className="w-full py-3 px-5 BORDER"
                            />
                            <InputError message={errors.bank_name} />
                        </div>
                    </div>
                )}

                {/* Crypto Fields */}
                {data.type === "crypto" && (
                    <div className="border-t pt-4 flex flex-col gap-4">
                        <h3 className="font-semibold text-lg mb-2 text-slate-500">Crypto Wallet Details</h3>

                        <div>
                            <InputLabel htmlFor="wallet_address">Wallet Address</InputLabel>
                            <TextInput

                                type="text"
                                value={data.wallet_address}
                                onChange={(e) => setData("wallet_address", e.target.value)}
                                  className="w-full py-3 px-5 BORDER"
                            />
                            <InputError message={errors.wallet_address} />
                        </div>

                        <div>
                            {/* <InputLabel htmlFor="icon" value="Upload Icon" /> */}
                            <FileUpload
                                label="Upload Icon"
                                name="icon"
                                multiple={false}
                                image={data.icon}
                                setData={setData}
                                accept={[".jpg", ".jpeg", ".png"]}
                                error={errors.icon}
                            />
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md"
                        disabled={processing}
                    >
                        {processing ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
