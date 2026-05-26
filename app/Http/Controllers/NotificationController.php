<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    // Get all notifications for the authenticated user
    public function index()
    {
        $notifications = auth()->user()->notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'message' => $notification->data['message'] ?? '',
                'read' => $notification->read_at ? true : false,
                'created_at' => $notification->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    // Mark a notification as read
    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return back()->with('success', 'Notification marked as read');
    }

    // Mark all notifications as read
    public function markAllAsRead()
    {
        auth()->user()->notifications->markAsRead();

        return back()->with('success', 'All notifications marked as read');
    }
}
