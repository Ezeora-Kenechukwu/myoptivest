<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BankResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'name' => $this->name,
            'code' => $this->code,
            'ussdTemplate' => $this->ussd_template,
            'baseUssdCode' => $this->base_ussd_code,
            'transferUssdTemplate' => $this->transfer_ussd_template
        ];
    }
}
