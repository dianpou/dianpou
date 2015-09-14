<?php namespace App\Models;

use App\Libraries\Interfaces\Operator;
use App\Libraries\Authenticatable;
use Carbon\Carbon;

class User extends Model {
    use Authenticatable;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password', 'nickname', 'avatar'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    public static function bind($openid, $provider)
    {
        $user = User::with('openids')->where('email', '=', $openid->getEmail())->first();
        $user_open_id = new UserOpenid([
            'provider' => $provider,
            'provider_user_id' => $openid->getId(),
            'access_token' => $openid->token,
            'expires_at' => Carbon::now()->addMinutes(5),
        ]);
        if (!$user) {
            $user = new User([
                'email' => $openid->getEmail(),
                'name'  => $openid->getName(),
                'nickname'  => $openid->getNickname(),
                'avatar'  => $openid->getAvatar(),
            ]);
            $user->save();
            $user->openids()->save($user_open_id);
        } else {
            $exists = $user->openids->where('provider', $provider)->where('provider_user_id', (string)$openid->getId());
            if ($exists->isEmpty()) {
                $user->openids()->save($user_open_id);
            } else {
                $exists->first()->fill($user_open_id->getAttributes())->save();
            }
        }

        return $user;
    }

    public function getValidations() {
        return array(
            'email' => 'required|email|unique:users,email' . $this->uniqueExcept(),
            'nickname' => 'required|unique:users,nickname' . $this->uniqueExcept(),
            );
    }

    public function save($options = [])
    {
        if ($this->isDirty()) {
            $changed = $this->getDirty();
            if ($changed['password']) {
                $this->password = \Hash::make($changed['password']);
            }
        }
        parent::save($options);
    }

    public function bagItems()
    {
        return $this->hasMany('App\Models\Bag');
    }
    public function orders()
    {
        return $this->hasMany('App\Models\Order');
    }

    public function refunds()
    {
        return $this->hasMany('App\Models\Refund');
    }

    public function addresses()
    {
        return $this->hasMany('App\Models\Address');
    }

    public function Reject()
    {
        return $this->hasMany('App\Models\Reject');
    }

    public function openids()
    {
        return $this->hasMany('App\Models\UserOpenid');
    }
    public function getOperatorType()
    {
        return 'App\Models\User';
    }

    public function getOperatorId()
    {
        return $this->id;
    }
}
