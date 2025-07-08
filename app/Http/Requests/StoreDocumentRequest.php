<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // User must be authenticated, in a current organization,
        // and the project must belong to that organization.
        return auth()->check()
            && auth()->user()->current_organization_id
            && $this->route('project')->organization_id === auth()->user()->current_organization_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $this->merge([
            'organization_id' => auth()->user()->current_organization_id,
            'uploaded_by_user_id' => auth()->id(),
        ]);
    
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'file' => ['required', 'file', 'max:10240'], // 10MB limit
            'organization_id' => ['required', 'integer'],
            'uploaded_by_user_id' => ['required', 'integer'],
        ];
    }
    

    /**
     * Prepare the data for validation.
     */
   
}