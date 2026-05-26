<?php
namespace App\Http\Middleware;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'permissions' => fn () => $request->user() ? $this->sharedPermissions($request->user()) : [],
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'unauthorized' => fn () => $request->session()->get('unauthorized'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'notifications' => fn () => $request->user() ? $request->user()->notifications()->latest()->get() : [],
        ];
    }

    protected function sharedPermissions(User $user)
    {
        $abilityKeys = $this->abilityKeys();

        if ($user->type === 'admin') {
            return Permission::query()
                ->where('active', true)
                ->get()
                ->map(fn ($permission) => [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'abilities' => array_fill_keys($abilityKeys, true),
                ]);
        }

        $permissions = collect();

        foreach ($user->permissions as $permission) {
            $permissions->put($permission->name, [
                'id' => $permission->id,
                'name' => $permission->name,
                'abilities' => $permission->pivot->only($abilityKeys),
            ]);
        }

        $user->loadMissing('roles.permissions');
        foreach ($user->roles as $role) {
            foreach ($role->permissions as $permission) {
                $current = $permissions->get($permission->name, [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'abilities' => array_fill_keys($abilityKeys, false),
                ]);

                foreach ($abilityKeys as $ability) {
                    $current['abilities'][$ability] = (bool) ($current['abilities'][$ability] ?? false)
                        || (bool) ($permission->pivot->{$ability} ?? false);
                }

                $permissions->put($permission->name, $current);
            }
        }

        return $permissions->values();
    }

    protected function abilityKeys(): array
    {
        return [
            'can_create', 'can_edit', 'can_view', 'can_delete', 'can_forceDelete', 'can_index',
            'can_store', 'can_approve', 'can_restore', 'can_indexTrash', 'can_viewTrash',
            'can_assign', 'can_update', 'can_join', 'can_pin', 'can_share', 'can_copy',
            'can_download', 'can_preview', 'can_upload', 'can_pay', 'can_withdraw',
            'can_rank', 'can_show', 'can_block', 'can_unblock', 'can_activate',
            'can_deactivate', 'can_suspend', 'can_unsuspend', 'can_confirm',
            'can_reply', 'can_send', 'can_notify', 'can_read', 'can_readall',
        ];
    }

}
