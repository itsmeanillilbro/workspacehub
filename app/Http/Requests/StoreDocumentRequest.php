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
        return [
            'file' => ['required', 'file', 'max:10240'], // Max 10MB file size
            'name' => ['nullable', 'string', 'max:255'], // Optional name, defaults to filename
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'organization_id' => auth()->user()->current_organization_id,
            'project_id' => $this->route('project')->id,
            'uploaded_by_user_id' => auth()->id(),
        ]);
    }
}