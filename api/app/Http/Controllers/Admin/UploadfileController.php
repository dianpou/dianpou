<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\UploadFile;

class UploadfileController extends Controller {

    protected $model = 'App\Models\UploadFile';
    protected $sortable   = ['created_at'];
    public function store(Request $request)
    {
        $file = new UploadFile($request->json()->all());
        $file->save();

        return response()->created($file);
    }

    public function show(Request $request, $id)
    {
        $file = UploadFile::findOrFail($id);
        return response($file->getContents())->header('Content-Type', $file->file_type);
    }

    // public function destroy(Request $request, $id)
    // {
    // 	$file = UploadFile::findOrFail($id);
    // 	$file->delete();
    // 	return response()->deleted();
    // }
}
