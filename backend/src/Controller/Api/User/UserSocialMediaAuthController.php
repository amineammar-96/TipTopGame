<?php
namespace App\Controller\Api\User;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use League\OAuth2\Client\Provider\Google;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\Facebook;


class UserSocialMediaAuthController extends AbstractController
{
    public function facebookCallback(Request $request, Facebook $provider)
    {
        try {
            // Get the OAuth access token using the callback code
            $accessToken = $provider->getAccessToken('authorization_code', [
                'code' => $request->query->get('code'),
            ]);

            // Use the access token to fetch the user details from Facebook API
            $facebookUser = $provider->getResourceOwner($accessToken);

            // You can now handle the user details or authenticate the user in your application
            // For example, you can save the user details in the database or log the user in

            // Generate a JWT token for the user
            $jwtManager = $this->get('lexik_jwt_authentication.jwt_manager');
            $token = $jwtManager->create($facebookUser->toArray());

            // Return the JWT token to the client
            return new JsonResponse(['token' => $token]);
        } catch (IdentityProviderException $e) {
            // Handle authentication failure
            return new JsonResponse(['error' => 'Authentication failed'], 401);
        }
    }

   

    public function googleCallback(Request $request)
    {
        $code = $request->query->get('code');
        dd($code); // This will display the value of the 'code' parameter in the query string
    
        try {
            // Create a new instance of the Google provider
            $provider = new Google([
                'clientId' => '%env(GOOGLE_CLIENT_ID)%',
                'clientSecret' => '%env(GOOGLE_CLIENT_SECRET)%',
                'redirectUri' => 'your_redirect_uri_here',
            ]);

            // Get the OAuth access token using the callback code
            $accessToken = $provider->getAccessToken('authorization_code', [
                'code' => $request->query->get('code'),
            ]);

            // Use the access token to fetch the user details from Google API
            $googleUser = $provider->getResourceOwner($accessToken);

            // Rest of your code here...

        } catch (IdentityProviderException $e) {
            // Handle authentication failure
            return new JsonResponse(['error' => 'Authentication failed'], 401);
        }
    }

    // public function googleCallback(Request $request, GoogleProvider $provider)
    // {
    //     $provider = $providerFactory(['clientId' => 'your_client_id', 'clientSecret' => 'your_client_secret']);

    //     try {
    //         // Get the OAuth access token using the callback code
    //         $accessToken = $provider->getAccessToken('authorization_code', [
    //             'code' => $request->query->get('code'),
    //         ]);

    //         // Use the access token to fetch the user details from Google API
    //         $googleUser = $provider->getResourceOwner($accessToken);

    //         // You can now handle the user details or authenticate the user in your application
    //         // For example, you can save the user details in the database or log the user in

    //         // Generate a JWT token for the user
    //         $jwtManager = $this->get('lexik_jwt_authentication.jwt_manager');
    //         $token = $jwtManager->create($googleUser->toArray());

    //         // Return the JWT token to the client
    //         return new JsonResponse(['token' => $token]);
    //     } catch (IdentityProviderException $e) {
    //         // Handle authentication failure
    //         return new JsonResponse(['error' => 'Authentication failed'], 401);
    //     }
    // }
}
