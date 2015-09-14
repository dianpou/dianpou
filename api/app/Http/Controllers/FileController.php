<?php namespace App\Http\Controllers;

use DB, Auth, Response, Authorizer, Storage, Image;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Http\Controllers\Base\Controller;
use Illuminate\Http\Request;
use App\Models\UploadFile;

class FileController extends Controller
{
    public function index(Request $request, $path) {
        $file = UploadFile::select()->where('file_path', '=', $path)->firstOrFail();

        $contents = $file->getContents();
        $file_size = $file->file_size;
        if (($size = $request->input('size')) && in_array($size, ['small', 'medium', 'large', 'xlarge'])) {
            $size_table = [ 'small' => 64, 'medium' => 128, 'large' => 256, 'xlarge' => 512];

            return Image::cache(function ($image) use($size_table, $contents, $size) {
                $original = Image::make($contents);
                $ratio      = $original->width() / $original->height();
                $width      = $ratio > 1 ? $size_table[$size] : $size_table[$size] * $ratio;
                $height     = $ratio > 1 ? $width / $ratio :  $size_table[$size];

                $image->make($original)->resize($width, $height);
            }, 60, true)->response();
        } else {
            return response($contents, 200)
                    ->header('Content-Type', $file->file_type)
                    ->header('Content-Length', $file_size);
        }

    }
}
