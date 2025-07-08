<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
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
            'project_id' => $this->route('project')->id,
            'created_by_user_id' => auth()->id(),
        ]);
    
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:pending,in-progress,completed,blocked'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['nullable', 'integer', 'min:0', 'max:10'],
           'assigned_to_user_id' => [
    'nullable',
    'exists:users,id',
    Rule::exists('organization_user', 'user_id')->where(function ($query) {
        $query->where('organization_id', auth()->user()->current_organization_id);
    }),
],

            // You can add these to ensure they're required or just let them pass through
            'organization_id' => ['required', 'integer'],
            'project_id' => ['required', 'integer'],
            'created_by_user_id' => ['required', 'integer'],
        ];
    }
    

}