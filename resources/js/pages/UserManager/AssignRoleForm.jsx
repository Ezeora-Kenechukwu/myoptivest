import React from 'react';
import { LoaderCircle } from 'lucide-react';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have this
import InputError from '@/components/input-error';

const AssignRoleForm = ({ submit, data, setData, roles, show, onClose, processing, errors }) => {
    const toggleRole = (roleId) => {
        let updated = [...data.role_ids];
        if (updated.includes(roleId)) {
            updated = updated.filter(id => id !== roleId);
        } else {
            updated.push(roleId);
        }
        setData('role_ids', updated);
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form className="flex flex-col gap-6 px-5 py-10" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label>Assign Roles</Label>
                        {roles.map(role => (
                            <div key={role.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`role-${role.id}`}
                                    checked={data.role_ids.includes(role.id)}
                                    onCheckedChange={() => toggleRole(role.id)}
                                />
                                <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                            </div>
                        ))}
                        <InputError message={errors.role_ids} />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <Button type="submit" className="w-1/2" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Assign Roles
                        </Button>
                        <Button type="button" className="bg-red-500 text-white w-1/2" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default AssignRoleForm;
