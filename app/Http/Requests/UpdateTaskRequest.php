<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // User must be authenticated, in the same organization as the task's project.
        return auth()->check()
            && $this->task->organization_id === auth()->user()->current_organization_id;
            // Later: && auth()->user()->can('update', $this->task);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:pending,in-progress,completed,blocked'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['nullable', 'integer', 'min:0', 'max:10'],
            'assigned_to_user_id' => [
                'nullable',
                'exists:users,id',
                Rule::exists('organization_user')->where(function ($query) {
                    $query->where('organization_id', auth()->user()->current_organization_id);
                }),
            ],
        ];
    }
}